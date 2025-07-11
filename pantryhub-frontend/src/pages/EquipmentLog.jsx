import LayoutWrapper from '../components/layout/LayoutWrapper';
import Topbar from '../components/layout/Topbar';
import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function EquipmentLog() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        api.getEquipmentLogs()
        .then(res => setLogs(res))
        .catch(err => setError(err));
    }, []);

    const filteredLogs = logs.filter(log => {
        const query = searchQuery.toLowerCase();
        return (
            log.equipment_id?.toString().includes(query) ||
            log.user_id?.toLowerCase().includes(query) ||
            log.action?.toLowerCase().includes(query) ||
            new Date(log.timestamp).toLocaleString().toLowerCase().includes(query)
        );
    });

    return (
        <div className= "flex flex-col min-h-screen w-full">
            <LayoutWrapper
                showTopbar={true}
                searchQuery={searchQuery}
                onSearchChange={e => setSearchQuery(e.target.value)}>

            
                <div className = "text-xl font-bold text-center w-full p-8">
                    Equipment Log
                </div>

                <div className= "w-full mx-auto px-4">
                    {filteredLogs.length == 0 ? (
                        <div className="flex items-centre justify-center h-40">
                            <div className = "bg-white w-full p-12 rounded-lg shadow text-center text-lg font-semibold ">
                        No logs available.
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b-2 border-gray-300 p-4">Equipment ID</th>
                                    <th className="border b-2 border-gray-300 p-4">User ID</th>
                                    <th className="border-b-2 border-gray-300 p-4">Action</th>
                                    <th className="border-b-2 border-gray-300 p-4">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log, index) => ( 
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="border-b p-4">{log.equipment_id}</td>
                                        <td className='border-b p-4'>{log.user_id}</td>
                                        <td className="border-b p-4">{log.action}</td>
                                        <td className="border-b p-4">{new Date(log.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    )}
                </div>
            </LayoutWrapper>

        </div>
        

    )
}
