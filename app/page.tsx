"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Search from '../components/Search';
import Filter from '../components/Filter';
import { Analytics } from "@vercel/analytics/react"

const Home: React.FC = () => {
    const PATHTOCSV = './NCVS_2020.csv';
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [groupBy, setGroupBy] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(`Fetching data with searchQuery: ${searchQuery} and groupBy: ${groupBy}`);
                const response = await fetch(`https://thechosenmenace.pythonanywhere.com/?crime=${searchQuery}&group_by=${groupBy}`, {
                    mode: 'cors'
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Network response was not ok: ${errorText}`);
                }
                const imageBlob = await response.blob();
                const imageObjectUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageObjectUrl);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        if (searchQuery && groupBy) {
            fetchData();
        }
    }, [searchQuery, groupBy]);

    return (
        <div>
            <Head>
                <title>NCVS Crime Analysis</title>
                <meta name="description" content="Analyze crime data with filters and visualizations" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="p-8">
                <Analytics  />
                <h2 className="text-xl mb-4">Search and Filter Crimes</h2>
                <Search onSearch={setSearchQuery} />
                <Filter onFilterChange={setGroupBy} />
                <div className="mt-8">
                    <p>Search Query: {searchQuery}</p>
                    <p>Group By: {groupBy}</p>
                    <div className="mt-8 flex justify-center items-center">
                        <div className="text-center">
                            {isLoading && <p>Please enter your filters</p>}
                            {imageUrl && <img src={imageUrl} alt="Crime Data Visualization" />}
                            <p>Please review NCVS for the numbering references <a className='text-blue-500 hover:underline' href='https://bjs.ojp.gov/programs/ncvs#:~:text=Description,persons%20in%20about%20150%2C000%20households.'>here</a>.</p>
                            <p> Image generation can be a little slow due to usage of public backend deployer.</p>
                            <p> Please find the CSV file used in the analysis <a href={PATHTOCSV} download rel='noopener noreferrer'  className='text-blue-500 hover:underline'>here</a>.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;