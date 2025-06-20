import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, ChevronDown, ChevronUp, Eye, ArrowUpDown, Users, MessageSquare, Package, Car, FileBarChart, ClipboardList } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TopActionsBar from "@/components/common/TopActionsBar";
import SearchInput from "@/components/common/SearchInput";
import NewDriverModal from "@/components/modals/NewDriverModal";
import type { Driver } from "@shared/schema";

const DriverFilterDropdown = ({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    serial_number: "",
    full_name: "",
    phone: ""
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setExpandedItem(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterUpdate = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) setExpandedItem(null);
  };

  const toggleSubmenu = (itemKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItem(expandedItem === itemKey ? null : itemKey);
  };

  const filterItems = [
    { key: 'serial_number', label: 'מספר סידורי', placeholder: 'הקלד מספר סידורי...' },
    { key: 'full_name', label: 'שם נהג', placeholder: 'הקלד שם נהג...' },
    { key: 'phone', label: 'טלפון', placeholder: 'הקלד טלפון...' }
  ];

  return (
    <div className="relative">
      <button ref={buttonRef} onClick={toggleDropdown} className="toolbar-btn">
        <Filter size={16} /> סינון
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-56 overflow-hidden">
          <ul>
            {filterItems.map(item => (
              <li key={item.key} className="border-b border-gray-100 last:border-b-0">
                <div 
                  className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 ${expandedItem === item.key ? 'bg-gray-100' : ''}`}
                  onClick={(e) => toggleSubmenu(item.key, e)}
                >
                  <span>{item.label}</span>
                  {expandedItem === item.key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {expandedItem === item.key && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">הקלד כאן</div>
                    <Input
                      type="text"
                      placeholder={item.placeholder}
                      value={filters[item.key as keyof typeof filters]}
                      onChange={(e) => handleFilterUpdate(item.key, e.target.value)}
                      className="w-full text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const statusConfig = {
  active: { label: "פעיל", className: "bg-green-100 text-green-800" },
  busy: { label: "עסוק", className: "bg-yellow-100 text-yellow-800" },
  offline: { label: "לא מחובר", className: "bg-gray-200 text-gray-800" },
  suspended: { label: "מושעה", className: "bg-red-100 text-red-800" },
  inactive: { label: "לא פעיל", className: "status-pill-inactive" }
};

export default function Drivers() {
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    serial_number: "",
    full_name: "",
    phone: ""
  });
  const [selectedDrivers, setSelectedDrivers] = useState(new Set<number>());
  const [selectAll, setSelectAll] = useState(false);
  const [isNewDriverModalOpen, setIsNewDriverModalOpen] = useState(false);
  const [selectedDriverForDetails, setSelectedDriverForDetails] = useState<Driver | null>(null);
  const [initialModalTab, setInitialModalTab] = useState('details');

  const { data: drivers = [], isLoading, refetch } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  useEffect(() => {
    filterDrivers();
  }, [drivers, searchTerm, filters]);

  const filterDrivers = () => {
    let filtered = drivers.filter(driver => 
      driver.full_name && driver.phone
    );

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(driver =>
        Object.values(driver).some(val => 
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    filtered = filtered.filter(driver => {
      return (
        (filters.serial_number ? driver.serial_number?.includes(filters.serial_number) : true) &&
        (filters.full_name ? driver.full_name.toLowerCase().includes(filters.full_name.toLowerCase()) : true) &&
        (filters.phone ? driver.phone?.includes(filters.phone) : true)
      );
    });

    setFilteredDrivers(filtered);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedDrivers(new Set(filteredDrivers.map(driver => driver.id)));
    } else {
      setSelectedDrivers(new Set());
    }
  };

  const handleSelectDriver = (driverId: number, checked: boolean) => {
    const newSelected = new Set(selectedDrivers);
    if (checked) {
      newSelected.add(driverId);
    } else {
      newSelected.delete(driverId);
    }
    setSelectedDrivers(newSelected);
    setSelectAll(newSelected.size > 0 && newSelected.size === filteredDrivers.length);
  };

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriverForDetails(driver);
    setInitialModalTab('details');
    console.log("Viewing driver details:", driver.id);
  };

  const handleShowReport = (driver: Driver) => {
    setSelectedDriverForDetails(driver);
    setInitialModalTab('reports');
    console.log("Showing driver reports:", driver.id);
  };

  const handleShowList = (driver: Driver) => {
    setSelectedDriverForDetails(driver);
    setInitialModalTab('payments');
    console.log("Showing driver payments:", driver.id);
  };

  const loadDrivers = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
       <style>{`
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .report-header h2 {
          font-size: 1.5rem;
          font-weight: 500;
        }
        .filters {
          display: flex;
          gap: 1rem;
        }
        .data-table-container {
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e9ecef;
        }
        .table-header, .table-row {
          display: grid;
          grid-template-columns: 50px 2fr 1.5fr 1.5fr 1.5fr 1fr 100px;
          align-items: center;
          padding: 15px 20px;
          gap: 15px;
        }
        .table-header {
          background-color: #f8f9fa;
          color: #6c757d;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid #dee2e6;
        }
        .table-row {
          border-bottom: 1px solid #f1f3f5;
          font-size: 15px;
        }
        .table-row:last-child {
          border-bottom: none;
        }
        .col-menu {
          text-align: left;
        }
        .status-pill-inactive {
          background-color: #ffe8cc;
          color: #ff8c00;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
          text-align: center;
        }
        .toolbar-btn {
          background: none;
          border: 1px solid #ced4da;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .col-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }
        .btn-icon-action {
          background: #fef8e7;
          border: 1px solid #f0dca4;
          color: #a8842c;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.2s;
        }
        .btn-icon-action:hover {
          background-color: #fff3cd;
          transform: translateY(-1px);
        }
      `}</style>
      
      <TopActionsBar />

      <section className="data-section">
        <div className="report-header">
          <h2>כל הנהגים <span className="text-gray-500 font-normal">({filteredDrivers.length})</span></h2>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsNewDriverModalOpen(true)} className="flex items-center gap-2">
              <Plus size={18} />
              נהג חדש
            </Button>
            <div className="filters">
              <SearchInput onSearch={setSearchTerm} placeholder="חיפוש..." />
              <DriverFilterDropdown onFilterChange={setFilters} />
            </div>
          </div>
        </div>

        <div className="data-table-container">
          <div className="table-header">
            <div>
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
            </div>
            <div className="flex items-center gap-1 cursor-pointer">שם נהג <ArrowUpDown size={14} /></div>
            <div>אזור מגורים</div>
            <div>טלפון</div>
            <div>טלפון נוסף</div>
            <div>משויך לערוץ</div>
            <div className="col-menu">פעולות</div>
          </div>
          <div className="table-body">
            {filteredDrivers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                לא נמצאו נהגים
              </div>
            ) : (
              filteredDrivers.map(driver => (
                <div key={driver.id} className="table-row">
                  <div>
                     <Checkbox
                      checked={selectedDrivers ? selectedDrivers.has(driver.id) : false}
                      onCheckedChange={(checked) => handleSelectDriver(driver.id, checked)}
                    />
                  </div>
                  <div className="font-semibold text-gray-900">{driver.full_name}</div>
                  <div>{driver.city || driver.address || 'N/A'}</div>
                  <div>{driver.phone}</div>
                  <div>{driver.additional_phone || 'N/A'}</div>
                  <div>
                    {driver.status === 'inactive' ? (
                       <span className="status-pill-inactive">
                         לא פעיל
                       </span>
                    ) : ('אין')}
                  </div>
                  <div className="col-actions">
                    <button 
                      onClick={() => handleShowReport(driver)}
                      className="btn-icon-action"
                      title="דוחות ופעולות"
                    >
                      <FileBarChart size={14} />
                    </button>
                    <button 
                      onClick={() => handleShowList(driver)}
                      className="btn-icon-action"
                      title="תשלומים"
                    >
                      <ClipboardList size={14} />
                    </button>
                    <button 
                      onClick={() => handleViewDriver(driver)}
                      className="btn-icon-action"
                      title="פרטים נוספים"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Dialog open={isNewDriverModalOpen} onOpenChange={setIsNewDriverModalOpen}>
        <DialogContent className="max-w-[650px] p-0" dir="rtl">
            <DialogHeader className="p-6 border-b text-right">
              <DialogTitle className="text-xl font-medium">נהג חדש</DialogTitle>
            </DialogHeader>
            <NewDriverModal setOpen={setIsNewDriverModalOpen} onDriverCreated={loadDrivers} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
