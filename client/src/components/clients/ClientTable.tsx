import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText, Eye, ArrowUpDown } from "lucide-react";
import type { Client } from "@shared/schema";

const statusConfig = {
  regular: { label: "קבוע", className: "bg-green-100 text-green-700" },
  casual: { label: "מזדמן", className: "bg-red-100 text-red-700" },
};

const paymentStatusConfig = {
  debt: { label: "חוב", className: "text-red-600 font-semibold" },
  credit: { label: "יתרה", className: "text-green-600 font-semibold" },
  paid: { label: "שולם", className: "text-blue-600 font-semibold" },
};

export default function ClientTable({ clients, onDelete, onView, onShowDetails }: {
  clients: Client[];
  onDelete?: (client: Client) => void;
  onView?: (client: Client) => void;
  onShowDetails?: (client: Client) => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <style>{`
        .client-table-header, .client-table-row {
          display: grid;
          grid-template-columns: 1fr 2fr 1.5fr 1fr 1.5fr 1fr 1.5fr 150px;
          align-items: center;
          padding: 15px 20px;
          gap: 15px;
        }
        
        .client-table-header {
          background-color: hsl(220, 14%, 96%);
          color: hsl(220, 9%, 43%);
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid hsl(220, 13%, 91%);
        }
        
        .client-table-row {
          border-bottom: 1px solid hsl(220, 26%, 97%);
          font-size: 15px;
          transition: background-color 0.2s;
        }
        
        .client-table-row:hover {
          background-color: hsl(220, 14%, 96%);
        }
        
        .client-table-row:last-child {
          border-bottom: none;
        }
        
        .col-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }
        
        .btn-icon-action {
          background: hsl(57, 100%, 95%);
          border: 1px solid hsl(48, 94%, 84%);
          color: hsl(30, 50%, 40%);
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
          background-color: hsl(48, 100%, 91%);
        }
      `}</style>
      
      <div className="client-table-header">
        <div className="flex items-center gap-2">מספר סידורי <ArrowUpDown size={14} className="text-gray-400" /></div>
        <div>שם לקוח</div>
        <div>טלפון</div>
        <div>סטטוס</div>
        <div>עיר</div>
        <div>תשלום</div>
        <div>תאריך אחרון</div>
        <div className="text-left">פעולות</div>
      </div>
      
      <div>
        {clients.map((client) => {
          const statusStyle = statusConfig[client.status as keyof typeof statusConfig] || statusConfig.regular;
          const paymentStyle = paymentStatusConfig[client.payment_status as keyof typeof paymentStatusConfig] || paymentStatusConfig.paid;
          
          return (
            <div key={client.id} className="client-table-row">
              <div className="font-medium">{client.serial_number}</div>
              <div className="font-semibold">{client.full_name}</div>
              <div>{client.phone}</div>
              <div><Badge className={`${statusStyle.className} border`}>{statusStyle.label}</Badge></div>
              <div>{client.city}</div>
              <div className={paymentStyle.className}>{paymentStyle.label}</div>
              <div>{client.last_activity_date ? format(new Date(client.last_activity_date), "dd/MM/yyyy") : 'N/A'}</div>
              <div className="col-actions">
                <button onClick={() => onDelete?.(client)} className="btn-icon-action" title="מחיקה"><Trash2 size={14} /></button>
                <button onClick={() => onShowDetails?.(client)} className="btn-icon-action" title="פרטים"><FileText size={14} /></button>
                <button onClick={() => onView?.(client)} className="btn-icon-action" title="צפייה"><Eye size={14} /></button>
              </div>
            </div>
          );
        })}
        
        {clients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            אין לקוחות להציג
          </div>
        )}
      </div>
    </div>
  );
}
