"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Search from '../components/Search';
import Filter from '../components/Filter';

const Home: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [groupBy, setGroupBy] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use the correct API endpoint
                const response = await fetch(`http://localhost:8080/api/home?crime=${searchQuery}&group_by=${groupBy}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const imageBlob = await response.blob();
                const imageObjectUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageObjectUrl);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
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
                <h2 className="text-xl mb-4">Search and Filter Crimes</h2>
                <Search onSearch={setSearchQuery} />
                <Filter onFilterChange={setGroupBy} />
                <div className="mt-8">
                    <p>Search Query: {searchQuery}</p>
                    <p>Group By: {groupBy}</p>
                    <div className="mt-8 flex justify-center items-center">
                        <div className="text-center">
                            {imageUrl && <img src={imageUrl} alt="Crime Data Visualization" />}
                            <p>Please review NCVS for the numbering references.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;