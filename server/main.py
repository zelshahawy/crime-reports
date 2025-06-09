import matplotlib

matplotlib.use("Agg")

from contextlib import asynccontextmanager
from functools import lru_cache
from typing import List, Literal

import pandas as pd
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

CrimeType = Literal["BROKEN_IN", "VEHICLE_THEFT", "FORCED_SEX", "STOLEN", "TOTAL_CRIME"]
ALLOWED_ORIGINS = ["https://crime-report-web-app.vercel.app", "http://localhost:3000"]


class Dataset(BaseModel):
    label: str
    data: List[float]
    backgroundColor: str
    borderColor: str
    borderWidth: int


class ChartData(BaseModel):
    labels: List[str]
    datasets: List[Dataset]


# --- App init ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    raw = pd.read_csv("NCVS_2020.csv")
    app.state.df = filter_and_adjust(raw)
    yield


app = FastAPI(
    title="Crime Analysis API",
    version="1.0",
    description="Group and average NCVS crime data",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def check_origin(request: Request, call_next):
    """
    Middleware to check the request origin against allowed origins.
    """
    origin = request.headers.get("origin")
    if not origin or origin not in ALLOWED_ORIGINS:
        raise HTTPException(403, "Origin not permitted")
    return await call_next(request)


# --- Data loading & preprocessing ---
def filter_and_adjust(df: pd.DataFrame) -> pd.DataFrame:
    """Filter and adjust the DataFrame for analysis."""
    df = df.copy()
    for col in ["BROKEN_IN", "VEHICLE_THEFT", "FORCED_SEX", "STOLEN"]:
        df[col] = (df[col] == 1).astype(int)
    df["TOTAL_CRIME"] = df[["BROKEN_IN", "VEHICLE_THEFT", "FORCED_SEX", "STOLEN"]].sum(
        axis=1
    )
    return df


@lru_cache(maxsize=32)
def make_chart(crime: CrimeType, group_by: str) -> ChartData:
    """Create a chart data object for the specified crime and grouping."""
    df = app.state.df
    if group_by not in df.columns:
        raise HTTPException(400, f"Invalid group_by: {group_by}")
    grouped = df.groupby(group_by)[[crime]].mean()
    labels = grouped.index.astype(str).tolist()
    data = grouped[crime].tolist()
    ds = Dataset(
        label=f"{crime}_AVERAGES",
        data=data,
        backgroundColor="rgba(75,192,192,0.2)",
        borderColor="rgba(75,192,192,1)",
        borderWidth=1,
    )
    return ChartData(labels=labels, datasets=[ds])


# --- Endpoint ---
@app.get("/api/home", response_model=ChartData, summary="Get averaged crime data")
def get_crime(
    crime: CrimeType = Query(..., description="Which crime to average"),
    group_by: str = Query(..., description="Column to group by, e.g. AGE"),
) -> ChartData:
    """
    Get averaged crime data grouped by a specified column.
    """
    return make_chart(crime, group_by)
