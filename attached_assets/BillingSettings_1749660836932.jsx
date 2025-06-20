import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Search } from 'lucide-react';

const channelData = [
    { id: 1, number: '655', fee: '158.5' },
    { id: 2, number: '656', fee: '160.0' },
    { id: 3, number: '657', fee: '155.0' },
    { id: 4, number: '658', fee: '170.0' },
];

export default function BillingSettings() {
    return (
        <div className="flex flex-col gap-6">
            <style>{`
                .settings-card { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.5rem; }
                .settings-card h3 { font-weight: 500; margin: 0 0 1.5rem 0; font-size: 1.125rem;}
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-size: 0.9rem; color: #6c757d; }
                .input-with-icon { position: relative; }
                .input-with-icon .icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6c757d; pointer-events: none;}
                .settings-content input { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 0.7rem; width: 100%; box-sizing: border-box; }
                
                .card-actions { margin-top: 1.5rem; display: flex; justify-content: flex-end; }
                .btn-add-field { background-color: #fef8e7; border: 1px solid #f0dca4; color: #212529; font-weight: 700; padding: 0.7rem 1.5rem; border-radius: 8px; }
                .btn-add-field:hover { background-color: #fff3cd; }

                .search-bar { position: relative; margin-bottom: 1.5rem; }
                .search-bar .icon-search { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: #6c757d; }
                .search-bar input { padding-right: 2.5rem !important; }

                .channel-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
                .channel-card {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-right: 4px solid #fdd85d;
                    border-radius: 6px;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .channel-card span { font-size: 0.9rem; color: #6c757d; }
                .channel-card strong { font-weight: 500; font-size: 1.1rem; }
            `}</style>

            <div className="settings-card">
                <h3>תשלומים קבועים</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>תשלום דמי חבר קבוע</label>
                        <div className="input-with-icon">
                            <Input />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>תשלומי אחדים</label>
                        <div className="input-with-icon">
                            <Input />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <h3>תשלום פרמיות</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>תשלום קבוע</label>
                        <div className="input-with-icon">
                            <Input />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>אחוזי נסיעות</label>
                        <div className="input-with-icon">
                            <Input />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                </div>
                <div className="card-actions">
                    <Button className="btn-add-field">שדה תשלום חדש</Button>
                </div>
            </div>

            <div className="settings-card">
                <h3>תשלומים לפי ערוץ</h3>
                <div className="search-bar">
                    <Search size={18} className="icon-search" />
                    <Input placeholder="חיפוש" />
                </div>
                <div className="channel-cards-grid">
                    {channelData.map(channel => (
                        <div key={channel.id} className="channel-card">
                            <span>מספר ערוץ</span>
                            <strong>{channel.number}</strong>
                            <span>עלות דמי חבר</span>
                            <strong>₪ {channel.fee}</strong>
                        </div>
                    ))}
                </div>
                <div className="card-actions">
                    <Button className="btn-add-field">הוספת ערוץ חדש</Button>
                </div>
            </div>
        </div>
    );
} 