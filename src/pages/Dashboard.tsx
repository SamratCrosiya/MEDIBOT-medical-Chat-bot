import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Receipt,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Car,
  Utensils,
  Building,
  Wifi,
  Download,
  Filter,
  Calendar
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Demo data
const categoryData = [
  { name: "Food & Dining", value: 12500, color: "#10b981" },
  { name: "Transportation", value: 8200, color: "#06b6d4" },
  { name: "Office Supplies", value: 5600, color: "#8b5cf6" },
  { name: "Utilities", value: 4200, color: "#f59e0b" },
  { name: "Others", value: 3500, color: "#6b7280" }
];

const monthlyData = [
  { month: "Jan", amount: 8500 },
  { month: "Feb", amount: 9200 },
  { month: "Mar", amount: 7800 },
  { month: "Apr", amount: 11500 },
  { month: "May", amount: 10200 },
  { month: "Jun", amount: 9800 }
];

const recentReceipts = [
  { id: 1, vendor: "Amazon Business", category: "Office Supplies", amount: 2499, date: "Dec 15, 2024", icon: ShoppingBag },
  { id: 2, vendor: "Uber", category: "Transportation", amount: 450, date: "Dec 14, 2024", icon: Car },
  { id: 3, vendor: "Swiggy", category: "Food & Dining", amount: 680, date: "Dec 14, 2024", icon: Utensils },
  { id: 4, vendor: "WeWork", category: "Office Space", amount: 15000, date: "Dec 12, 2024", icon: Building },
  { id: 5, vendor: "Airtel", category: "Utilities", amount: 999, date: "Dec 10, 2024", icon: Wifi }
];

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              InvoiceIQ
            </span>
          </Link>
          <Link to="/upload">
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Upload Receipt
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">Track and manage your business expenses</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-border">
                <Calendar className="w-4 h-4 mr-2" />
                This Month
              </Button>
              <Button variant="outline" size="sm" className="border-border">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total This Month</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Receipt className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-xs text-cyan-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8
                </span>
              </div>
              <p className="text-2xl font-bold">47</p>
              <p className="text-sm text-muted-foreground">Receipts Processed</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <ShoppingBag className="w-5 h-5 text-violet-400" />
                </div>
              </div>
              <p className="text-2xl font-bold">₹12,500</p>
              <p className="text-sm text-muted-foreground">Top Category (Food)</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <TrendingDown className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-xs text-amber-400">-5%</span>
              </div>
              <p className="text-2xl font-bold">₹726</p>
              <p className="text-sm text-muted-foreground">Avg per Receipt</p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Category Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
              <div className="flex items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">₹{category.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Monthly Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]}
                    />
                    <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Recent Receipts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Receipts</h3>
              <Button variant="ghost" size="sm" className="text-emerald-400">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentReceipts.map((receipt) => (
                <div 
                  key={receipt.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                      <receipt.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">{receipt.vendor}</p>
                      <p className="text-sm text-muted-foreground">{receipt.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{receipt.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{receipt.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
