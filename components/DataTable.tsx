import { ChartData } from 'chart.js';
import React from 'react';

interface DataTableProps {
	data: ChartData<'bar'>;
	groupBy: string;
	searchQuery: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, groupBy, searchQuery }) => {
	const labels = data.labels as (string | number)[];
	const values = data.datasets[0]?.data as number[];

	return (
		<table className="min-w-full bg-white border">
			<thead>
				<tr>
					<th className="px-4 py-2 border-b">{groupBy}</th>
					<th className="px-4 py-2 border-b">{searchQuery}_Avg</th>
				</tr>
			</thead>
			<tbody>
				{labels.map((label, i) => (
					<tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
						<td className="px-4 py-2 border-b text-center">{label}</td>
						<td className="px-4 py-2 border-b text-center">{values[i]?.toFixed(4)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default DataTable;
