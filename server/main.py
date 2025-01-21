import matplotlib
matplotlib.use('Agg')  # Use the Agg backend for non-GUI environments

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import matplotlib.pyplot as plt

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (if needed for cross-domain requests, e.g. from a frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ['http://localhost:3000'] etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read your CSV data
crimes_data_2020 = pd.read_csv('NCVS_2020.csv')

def filter_and_adjust_age_group(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adjusts the crime columns to binary indicators and calculates the total of three crimes.

    Args:
        df (pd.DataFrame): The input DataFrame containing crime data.

    Returns:
        pd.DataFrame: The adjusted DataFrame with binary crime indicators and a total crime column.
    """
    adjusted_func = lambda x: 1 if x == 1 else 0
    filtered_df = df.copy()
    filtered_df['BROKEN_IN'] = filtered_df['BROKEN_IN'].apply(adjusted_func)
    filtered_df['VEHICLE_THEFT'] = filtered_df['VEHICLE_THEFT'].apply(adjusted_func)
    filtered_df['FORCED_SEX'] = filtered_df['FORCED_SEX'].apply(adjusted_func)
    filtered_df['TOTAL_OF_THREE_CRIMES'] = (
        filtered_df['BROKEN_IN'] 
        + filtered_df['FORCED_SEX'] 
        + filtered_df['VEHICLE_THEFT']
    )
    return filtered_df

filtered_by_age_and_adjusted_results = filter_and_adjust_age_group(crimes_data_2020)

def filtering_and_grouping(
    main_dataframe: pd.DataFrame,
    list_of_columns_of_interest: list,
    variable: str
) -> pd.DataFrame:
    """
    Groups the DataFrame by a specified variable and calculates 
    the mean for the columns of interest.
    
    Args:
        main_dataframe (pd.DataFrame): The input DataFrame to be grouped.
        list_of_columns_of_interest (list): The columns for which the mean is calculated.
        variable (str): The column by which to group the DataFrame.

    Returns:
        pd.DataFrame: The grouped DataFrame with mean values.
    """
    grouped_data_mean = main_dataframe.groupby(variable)[list_of_columns_of_interest].mean()
    return grouped_data_mean

@app.get("/api/home")
def get_crime_data(crime: str, group_by: str):
    """
    API endpoint to get crime data based on the specified crime type and grouping variable.

    Query Parameters:
        crime (str): The type of crime to analyze (e.g., 'BROKEN_IN').
        group_by (str): The variable by which to group the data (e.g., 'AGE').

    Returns:
        A PNG image (bar plot) or a JSON error message.
    """
    # Validate the requested crime column
    if crime not in filtered_by_age_and_adjusted_results.columns:
        raise HTTPException(status_code=400, detail="Invalid crime type")

    # Group the data
    grouped_data = filtering_and_grouping(filtered_by_age_and_adjusted_results, [crime], group_by)

    # Create the plot
    fig = grouped_data.plot(
        kind='bar',
        y=crime,
        legend=False,
        title=f'{crime} by {group_by}'
    ).get_figure()
    plt.xlabel(group_by)
    plt.ylabel(f'{crime} AVERAGES')

    # Save figure to an in-memory bytes buffer
    img = io.BytesIO()
    fig.savefig(img, format='png')
    img.seek(0)
    plt.close(fig)

    # Return as a streaming response (PNG image)
    return StreamingResponse(img, media_type="image/png")
