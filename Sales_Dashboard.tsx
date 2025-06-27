'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LineChart, Line, 
  BarChart, Bar, 
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  FiSearch, 
  FiAlertTriangle, 
  FiDollarSign, 
  FiShoppingCart, 
  FiRefreshCw, 
  FiChevronDown, 
  FiChevronUp,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import { 
  FaRegStar, 
  FaStar,
  FaChartLine,
  FaChartPie,
  FaBoxOpen,
  FaRegBell
} from 'react-icons/fa';
import { FaChartColumn } from 'react-icons/fa6';

// Define CustomTooltip component first
const CustomTooltip = ({ active, payload, label, viewMode, darkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg shadow-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{label}</p>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {viewMode === 'Revenue' ? 'Revenue:' : 'Units Sold:'}{' '}
          <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {viewMode === 'Revenue' ? `$${payload[0].value.toLocaleString()}` : payload[0].value}
          </span>
        </p>
      </motion.div>
    );
  }
  return null;
};


const SalesDashboard = () => {
  // State management
  const [viewMode, setViewMode] = useState<'Revenue' | 'Units'>('Revenue');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const controls = useAnimation();
  const tickerRef = useRef<HTMLDivElement>(null);

  // Generate mock data based on time range
  const generateSalesData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const baseValue = timeRange === '7d' ? 
        Math.floor(Math.random() * 5000) + 2000 : 
        Math.floor(Math.random() * 3000) + 1000;
      
      return {
        date: timeRange === '7d' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i] : `Day ${i + 1}`,
        revenue: baseValue + (i * (timeRange === '7d' ? 500 : timeRange === '30d' ? 200 : 100)),
        units: Math.floor(baseValue / 50) + (i * (timeRange === '7d' ? 10 : timeRange === '30d' ? 5 : 2)),
        category: ['Electronics', 'Fitness', 'Home', 'Accessories'][Math.floor(Math.random() * 4)]
      };
    });
  };

  const [salesData, setSalesData] = useState(generateSalesData());

  // Calculate KPIs based on current data
  const { totalRevenue, totalUnits, avgOrderValue, categoryData } = useMemo(() => {
    const revenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
    const units = salesData.reduce((sum, day) => sum + day.units, 0);
    
    // Calculate category distribution
    const categoryMap = salesData.reduce((acc, day) => {
      acc[day.category] = (acc[day.category] || 0) + day.revenue;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categoryMap).reduce((sum, val) => sum + val, 0);
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
      color: 
        name === 'Electronics' ? '#3B82F6' :
        name === 'Fitness' ? '#10B981' :
        name === 'Home' ? '#F59E0B' : '#6366F1'
    }));

    return {
      totalRevenue: revenue,
      totalUnits: units,
      avgOrderValue: units > 0 ? revenue / units : 0,
      categoryData
    };
  }, [salesData]);

  // Top products data
  const topProducts = useMemo(() => {
    const baseProducts = [
      { 
        id: 1,
        name: 'Premium Wireless Earbuds', 
        category: 'Electronics',
        rating: 4.8,
        stock: 42
      },
      { 
        id: 2,
        name: 'Professional Yoga Mat', 
        category: 'Fitness',
        rating: 4.6,
        stock: 28
      },
      { 
        id: 3,
        name: 'High-Speed Blender', 
        category: 'Home',
        rating: 4.7,
        stock: 15
      },
      { 
        id: 4,
        name: 'Smart Fitness Watch', 
        category: 'Electronics',
        rating: 4.9,
        stock: 32
      },
      { 
        id: 5,
        name: 'Designer Travel Backpack', 
        category: 'Accessories',
        rating: 4.5,
        stock: 19
      }
    ];

    return baseProducts.map(product => ({
      ...product,
      sales: Math.floor(totalUnits * (0.1 + Math.random() * 0.3)),
      revenue: Math.floor(totalRevenue * (0.05 + Math.random() * 0.15)),
      image: 
        product.id === 1 ? 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg' :
        product.id === 2 ? 'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg' :
        product.id === 3 ? 'https://images.pexels.com/photos/6287298/pexels-photo-6287298.jpeg' :
        product.id === 4 ? 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg' :
        'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg'
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [totalRevenue, totalUnits]);

  // Low stock alerts
  const lowStockItems = [
    { id: 1, name: 'Wireless Earbuds', quantity: 3, threshold: 15, category: 'Electronics' },
    { id: 2, name: 'Yoga Mat', quantity: 7, threshold: 20, category: 'Fitness' },
    { id: 3, name: 'Stainless Water Bottle', quantity: 5, threshold: 25, category: 'Accessories' },
    { id: 4, name: 'Resistance Bands Set', quantity: 8, threshold: 30, category: 'Fitness' }
  ];

  // Live sales ticker
  const [tickerItems, setTickerItems] = useState<Array<{
    id: number;
    name: string;
    price: number;
    category: string;
    time: string;
  }>>([]);

  useEffect(() => {
    const products = [
      { name: 'Wireless Earbuds', price: 149.99, category: 'Electronics' },
      { name: 'Yoga Mat', price: 59.99, category: 'Fitness' },
      { name: 'Blender', price: 129.99, category: 'Home' },
      { name: 'Smart Watch', price: 249.99, category: 'Electronics' },
      { name: 'Backpack', price: 89.99, category: 'Accessories' },
      { name: 'Water Bottle', price: 29.99, category: 'Accessories' },
      { name: 'Resistance Bands', price: 39.99, category: 'Fitness' }
    ];

    const times = ['just now', '1 min ago', '2 mins ago', '5 mins ago'];

    const interval = setInterval(() => {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const timeShuffled = [...times].sort(() => 0.5 - Math.random());
      
      setTickerItems(
        shuffled.slice(0, 4).map((p, i) => ({ 
          ...p, 
          id: Date.now() + i,
          time: timeShuffled[i] || 'just now'
        }))
      );
      
      if (tickerRef.current) {
        tickerRef.current.scrollTo({
          top: tickerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const filteredProducts = topProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    await controls.start({
      rotate: 360,
      transition: { duration: 0.8 }
    });
    controls.start({ rotate: 0 });
    setSalesData(generateSalesData());
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Sales Analytics Dashboard</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time performance metrics and insights</p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            >
              <motion.div animate={controls}>
                <FiRefreshCw />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative flex-1 w-full">
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search products or categories..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={`flex rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <button
                onClick={() => setViewMode('Revenue')}
                className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'Revenue' ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <FiDollarSign />
                Revenue
              </button>
              <button
                onClick={() => setViewMode('Units')}
                className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'Units' ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <FiShoppingCart />
                Units
              </button>
            </div>

            <div className={`flex rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setTimeRange(range as any);
                    setSalesData(generateSalesData());
                  }}
                  className={`px-3 py-2 text-xs font-medium transition-all ${timeRange === range ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <FiTrendingUp className="mr-1" />
                  <span>+{Math.floor(Math.random() * 10) + 5}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl text-blue-500">
                  <FiDollarSign />
                </div>
                <div className="mt-4 text-3xl opacity-30 text-blue-300">
                  <FaChartLine />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Units Sold</p>
                <p className="text-2xl font-bold mt-1">{totalUnits.toLocaleString()}</p>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <FiTrendingUp className="mr-1" />
                  <span>+{Math.floor(Math.random() * 8) + 3}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl text-green-500">
                  <FiShoppingCart />
                </div>
                <div className="mt-4 text-3xl opacity-30 text-green-300">
                  <FaChartColumn />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Order Value</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(avgOrderValue)}</p>
                <div className="flex items-center mt-2 text-sm text-green-500">
                  <FiTrendingUp className="mr-1" />
                  <span>+{Math.floor(Math.random() * 5) + 1}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl text-yellow-500">
                  <FaRegStar />
                </div>
                <div className="mt-4 text-3xl opacity-30 text-yellow-300">
                  <FaChartPie />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Low Stock Items</p>
                <p className="text-2xl font-bold mt-1">{lowStockItems.length}</p>
                <div className="flex items-center mt-2 text-sm text-red-500">
                  <FiTrendingDown className="mr-1" />
                  <span>+{lowStockItems.length - 2}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl text-red-500">
                  <FiAlertTriangle />
                </div>
                <div className="mt-4 text-3xl opacity-30 text-red-300">
                  <FaBoxOpen />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} lg:col-span-2`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sales Trend ({timeRange})</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleSection('salesTrend')}
                  className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  {expandedSection === 'salesTrend' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedSection !== 'salesTrend' && (
                <motion.div
                  initial={{ height: 300 }}
                  animate={{ height: 300 }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={darkMode ? '#374151' : '#f0f0f0'} 
                          vertical={false} 
                        />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} 
                        />
                        <YAxis 
                          tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} 
                        />
                        <Tooltip 
                          content={<CustomTooltip viewMode={viewMode} darkMode={darkMode} />}
                        />
                        <Area 
                          type="monotone" 
                          dataKey={viewMode === 'Revenue' ? 'revenue' : 'units'} 
                          stroke="#3B82F6" 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          strokeWidth={2}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sales by Category</h2>
              <button 
                onClick={() => toggleSection('salesCategory')}
                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {expandedSection === 'salesCategory' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSection !== 'salesCategory' && (
                <motion.div
                  initial={{ height: 300 }}
                  animate={{ height: 300 }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{
                            background: darkMode ? '#1F2937' : 'white',
                            color: darkMode ? 'white' : 'black',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: darkMode ? '1px solid #374151' : 'none'
                          }}
                        />
                        <Legend 
                          layout="vertical" 
                          align="right" 
                          verticalAlign="middle"
                          wrapperStyle={{
                            color: darkMode ? 'white' : 'black'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Top Selling Products</h2>
              <button 
                onClick={() => toggleSection('topProducts')}
                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {expandedSection === 'topProducts' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSection !== 'topProducts' && (
                <motion.div
                  initial={{ height: 'auto' }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4">
                    {(searchQuery ? filteredProducts : topProducts).map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center gap-4 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-all cursor-pointer`}
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{product.category}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              i < Math.floor(product.rating) ? 
                                <FaStar key={i} className="text-yellow-400 text-xs" /> : 
                                <FaRegStar key={i} className="text-yellow-400 text-xs" />
                            ))}
                            <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {viewMode === 'Revenue' ? `$${product.revenue.toLocaleString()}` : `${product.sales} sold`}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Stock: {product.stock}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaRegBell className="text-blue-500" />
                Live Sales Activity
              </h2>
              <button 
                onClick={() => toggleSection('liveSales')}
                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {expandedSection === 'liveSales' ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            <AnimatePresence>
              {expandedSection !== 'liveSales' && (
                <motion.div
                  initial={{ height: 300 }}
                  animate={{ height: 300 }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div 
                    ref={tickerRef}
                    className="h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                  >
                    <AnimatePresence>
                      {tickerItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-center justify-between p-3 mb-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-md overflow-hidden ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                              {/* Placeholder for product image */}
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-500">+${item.price.toFixed(2)}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiAlertTriangle className="text-red-500" />
                Low Stock Alerts
              </h2>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'}`}>
                {lowStockItems.length} Items
              </div>
            </div>
            
            <AnimatePresence>
              {expandedSection !== 'lowStock' && (
                <motion.div
                  initial={{ height: 300 }}
                  animate={{ height: 300 }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="h-[300px] overflow-y-auto pr-2">
                    {lowStockItems.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ x: 5 }}
                        className={`flex items-center justify-between p-3 mb-2 rounded-lg border-l-4 border-red-500 ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <FiAlertTriangle className="text-red-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Only {item.quantity} left (reorder at {item.threshold})
                            </p>
                          </div>
                        </div>
                        <button className={`text-sm font-medium ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}>
                          Order
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SalesDashboard;