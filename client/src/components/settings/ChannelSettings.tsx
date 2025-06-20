import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function ChannelSettings() {
    const [formData, setFormData] = useState({
        channel_name: '',
        channel_nickname: '',
        channel_id_number: '',
        fixed_price: '',
        variable_price: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            // await Channel.create(formData);
            alert('ערוץ חדש נוצר בהצלחה!');
            // Here you might want to clear the form or give other feedback
        } catch (error) {
            console.error('Error creating channel:', error);
            alert('שגיאה ביצירת הערוץ.');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <style>{`
                .settings-card { background-color: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 1.5rem; }
                .settings-card h3 { font-weight: 500; margin: 0 0 1.5rem 0; font-size: 1.125rem; }
                .form-grid-three-col { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem 2rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-size: 0.9rem; color: #6c757d; }
                .label-info { font-size: 0.8rem; color: #6c757d; }
                .input-with-icon { position: relative; }
                .input-with-icon .icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #6c757d; pointer-events: none; }
                .settings-content input { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 0.7rem; width: 100%; box-sizing: border-box; }
                .card-actions { margin-top: 1.5rem; display: flex; justify-content: flex-end; }
                .btn-action { background-color: #fdd85d; border: none; padding: 0.7rem 1.5rem; font-weight: 700; border-radius: 8px; color: #212529; cursor: pointer; }
                .btn-action:hover { background-color: #fce047; }
            `}</style>

            <div className="settings-card">
                <h3>הוספת ערוץ חדש</h3>
                <div className="form-grid-three-col">
                    <div className="form-group">
                        <label>שם הערוץ</label>
                        <div className="input-with-icon">
                            <Input value={formData.channel_name} onChange={(e) => handleChange('channel_name', e.target.value)} />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>כינוי הערוץ</label>
                        <div className="input-with-icon">
                            <Input value={formData.channel_nickname} onChange={(e) => handleChange('channel_nickname', e.target.value)} />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>מספר זיהוי הערוץ <span className="label-info">8-16 תווים</span></label>
                        <div className="input-with-icon">
                            <Input value={formData.channel_id_number} onChange={(e) => handleChange('channel_id_number', e.target.value)} />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>מחיר קבוע</label>
                        <div className="input-with-icon">
                            <Input value={formData.fixed_price} onChange={(e) => handleChange('fixed_price', e.target.value)} />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>מחיר משתנה</label>
                        <div className="input-with-icon">
                            <Input value={formData.variable_price} onChange={(e) => handleChange('variable_price', e.target.value)} />
                            <Pencil size={16} className="icon" />
                        </div>
                    </div>
                </div>
                <div className="card-actions">
                    <Button className="btn-action" onClick={handleSubmit}>צור ערוץ חדש</Button>
                </div>
            </div>
        </div>
    );
}