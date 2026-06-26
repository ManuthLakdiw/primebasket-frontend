'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    DocumentTextIcon,
    ChartBarIcon,
    EnvelopeIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Area,
    AreaChart,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

import { getOrderStatusDistributionAction, getSalesRevenueAction} from "@/actions/report";
import { getAllCustomersAction } from "@/actions/user";
import { getOrdersAction } from "@/actions/order";
import { getAllProductsAction } from "@/actions/produts";
import { getAllCategoriesAction } from "@/actions/category";
import { ErrorModal } from "@/components/admin/ErrorModal";
import Pagination from "@/components/ui/Pagination";
import {getEmailLogsAction} from "@/actions/email-log";

const STATUS_COLORS: Record<string, string> = {
    'PENDING': '#EAB308',
    'PROCESSING': '#3B82F6',
    'PROCEED': '#6366f1',
    'SHIPPED': '#8B5CF6',
    'DELIVERED': '#22C55E',
    'CANCELLED': '#EF4444',
};

const statusStyles: Record<string, string> = {
    SENT: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
};

export default function ReportsPage() {
    const [selectedError, setSelectedError] = useState<string | undefined>(undefined);

    const [salesData, setSalesData] = useState<any[]>([]);
    const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
    const [loadingCharts, setLoadingCharts] = useState(true);

    const [emailLogs, setEmailLogs] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const logsPerPage = 5;
    useEffect(() => {
        const loadChartsData = async () => {
            setLoadingCharts(true);
            try {
                const [salesRes, statusRes] = await Promise.all([
                    getSalesRevenueAction(),
                    getOrderStatusDistributionAction()
                ]);

                if (salesRes.success) {
                    setSalesData(salesRes.data);
                } else {
                    toast.error("Failed to load sales data");
                }

                if (statusRes.success) {
                    const formattedStatusData = statusRes.data.map((item: any) => ({
                        name: item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase(),
                        value: item.count,
                        color: STATUS_COLORS[item.status] || '#9CA3AF'
                    }));
                    setOrderStatusData(formattedStatusData);
                } else {
                    toast.error("Failed to load status distribution");
                }
            } catch (error) {
                toast.error("Network error while loading charts");
            } finally {
                setLoadingCharts(false);
            }
        };

        loadChartsData();
    }, []);

    useEffect(() => {
        const loadEmailLogs = async () => {
            setLoadingLogs(true);
            try {
                const res = await getEmailLogsAction(currentPage - 1, logsPerPage);
                console.log(res)

                const logsContent = res.data?.content || res.data?.data?.content || [];
                const totalPagesCount = res.data?.totalPages || res.data?.data?.totalPages || 1;

                if (res.success) {
                    setEmailLogs(logsContent);
                    setTotalPages(totalPagesCount);
                } else {
                    toast.error("Failed to load email logs");
                }
            } catch (error) {
                toast.error("Network error while loading email logs");
            } finally {
                setLoadingLogs(false);
            }
        };

        loadEmailLogs();
    }, [currentPage]);

    const downloadPDF = async (reportName: string) => {
        const toastId = toast.loading(`Gathering data for ${reportName}...`);

        try {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.setTextColor(249, 115, 22);
            doc.text(`PrimeBasket - ${reportName}`, 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            let tableHead: string[][] = [];
            let tableBody: any[][] = [];

            if (reportName === 'Products Report') {
                const res = await getAllProductsAction(0, 1000);
                const content = res.data?.content || res.data?.data?.content;
                if (res.success && content) {
                    tableHead = [['ID', 'SKU', 'Product Name', 'Price (Rs.)', 'Selling Price (Rs.)', 'Stock', 'Status']];
                    tableBody = content.map((p: any) => [
                        p.id, p.sku, p.name, p.originalPrice?.toFixed(2) || '0.00', p.sellingPrice?.toFixed(2) || '0.00', p.stockQuantity, p.stockStatus
                    ]);
                }
            }
            else if (reportName === 'Orders Report') {
                const res = await getOrdersAction(undefined, 0, 1000);
                const content = res.data?.content || res.data?.data?.content;
                if (res.success && content) {
                    tableHead = [['Order No', 'Date', 'Customer Name', 'Total (Rs.)', 'Status']];
                    tableBody = content.map((o: any) => [
                        o.orderNumber, new Date(o.orderDate || o.createdAt).toLocaleDateString(), o.customerName, o.total?.toFixed(2) || '0.00', o.status
                    ]);
                }
            }
            else if (reportName === 'Users Report') {
                const res = await getAllCustomersAction(0, 1000);
                const content = res.data?.content || res.data?.data?.content;
                if (res.success && content) {
                    tableHead = [['Name', 'Email', 'Telephone', 'Status']];
                    tableBody = content.map((u: any) => [
                        `${u.firstName} ${u.lastName}`, u.email, u.telephone || 'N/A', u.isActivated ? 'Active' : 'Inactive'
                    ]);
                }
            }
            else if (reportName === 'Categories Report') {
                const res = await getAllCategoriesAction(0, 1000);
                const content = res.data?.content || res.data?.data?.content;
                if (res.success && content) {
                    tableHead = [['Id', 'Name', 'Description', 'Product Count']];
                    tableBody = content.map((category: any) => [
                        category.id, category.name, category.description || 'N/A', category.productCount || 0,
                    ]);
                }
            }
            else if (reportName === 'Email Logs') {
                const res = await getEmailLogsAction(0, 1000);
                const content = res.data?.content || res.data?.data?.content;
                if (res.success && content) {
                    tableHead = [['Date & Time', 'Recipient', 'Subject', 'Status', 'Error (If Any)']];
                    tableBody = content.map((log: any) => {
                        const formattedDate = new Date(log.sentAt).toLocaleString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        });
                        return [
                            formattedDate, log.recipientEmail, log.subject, log.status, log.errorMessage || 'None'
                        ];
                    });
                }
            }

            if (tableBody.length === 0) {
                toast.error("No data available for this report.", { id: toastId });
                return;
            }

            toast.loading(`Generating PDF...`, { id: toastId });

            autoTable(doc, {
                startY: 40,
                head: tableHead,
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [249, 250, 251] },
                styles: { fontSize: 9 },
            });

            const fileName = `${reportName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
            doc.save(fileName);

            toast.success(`${reportName} downloaded successfully!`, { id: toastId });

        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error(`Failed to generate ${reportName}`, { id: toastId });
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
                <p className="text-sm text-gray-500">Insights, downloads, and email logs</p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Revenue (Last 7 Days)</h3>
                    {loadingCharts ? (
                        <div className="flex-1 flex justify-center items-center h-[300px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : salesData.length === 0 ? (
                        <div className="flex-1 flex justify-center items-center h-[300px] text-gray-400">No data available</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `Rs.${value}`} />
                                <Tooltip formatter={(value) => [`Rs. ${Number(value).toFixed(2)}`, "Revenue"]} />
                                <Area type="monotone" dataKey="revenue" stroke="#F97316" fill="url(#colorRevenue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
                    {loadingCharts ? (
                        <div className="flex-1 flex justify-center items-center h-[300px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : orderStatusData.length === 0 ? (
                        <div className="flex-1 flex justify-center items-center h-[300px] text-gray-400">No data available</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, String(name)]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Download Center */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Center</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['Products Report', 'Categories Report', 'Users Report', 'Orders Report'].map((reportName) => (
                        <div key={reportName} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                                <DocumentTextIcon className="h-6 w-6 text-orange-500" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-800">{reportName}</h4>
                            <p className="text-xs text-gray-500 mt-1 mb-4">Click to generate PDF</p>
                            <button onClick={() => downloadPDF(reportName)} className="mt-auto inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                <ChartBarIcon className="h-4 w-4 mr-1" /> Download PDF
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🌟 Email Logs Section */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Email Logs</h3>
                    <button onClick={() => downloadPDF('Email Logs')} className="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors">
                        <EnvelopeIcon className="h-4 w-4 mr-1" /> Download Email Logs (PDF)
                    </button>
                </div>

                {loadingLogs ? (
                    <div className="flex justify-center items-center py-20 border border-gray-200 rounded-lg bg-white shadow-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                ) : emailLogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm">
                        <p>No email logs found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {emailLogs.map((log) => {
                            // දිනය සහ වේලාව ලස්සනට හදාගන්නවා
                            const formattedDate = new Date(log.sentAt).toLocaleString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            });

                            return (
                                <div key={log.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-800">{log.recipientEmail}</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${statusStyles[log.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {log.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{log.subject}</p>
                                        <p className="text-xs font-semibold text-gray-400 mt-1">{formattedDate}</p>
                                    </div>
                                    {log.status === 'FAILED' && log.errorMessage && (
                                        <button onClick={() => setSelectedError(log.errorMessage)} className="self-start sm:self-center inline-flex items-center px-3 py-1.5 text-xs font-bold text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors">
                                            <ExclamationCircleIcon className="h-4 w-4 mr-1" /> View Error
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loadingLogs && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                )}
            </div>

            <ErrorModal
                isOpen={!!selectedError}
                onClose={() => setSelectedError(undefined)}
                errorMessage={selectedError}
            />
        </div>
    );
}