import React, { useState } from 'react';
import { Driver } from '@/entities/Driver';
import { Channel } from '@/entities/Channel';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, MessageSquare, Star } from 'lucide-react';

export default function NewDriverModal({ setOpen, onDriverCreated }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    additional_phone: '',
    address: '',
    residence_area: '',
    email: '',
    id_number: '',
    channel_id: '',
    vehicle_license: '',
    vehicle_type: '',
    vehicle_seats: '',
    vehicle_condition: '',
    vehicle_category: '',
    fixed_charge: '250',
    variable_charge_percentage: '5',
    charge_is_default: true,
    charge_is_custom: false
  });
  const [channels, setChannels] = useState([]);
  
  React.useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsData = await Channel.list();
        setChannels(channelsData);
      } catch (error) {
        console.error("Error loading channels:", error);
      }
    };
    fetchChannels();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for required fields
    if (!formData.email) {
      alert('נא למלא כתובת מייל');
      return;
    }
    if (!formData.channel_id) {
      alert('נא לבחור שיוך לערוץ');
      return;
    }
    
    try {
      const driverData = {
        ...formData,
        full_name: `${formData.first_name} ${formData.last_name}`,
        join_date: new Date().toISOString().split('T')[0],
        status: 'inactive'
      };
      delete driverData.first_name;
      delete driverData.last_name;
      delete driverData.charge_is_default;
      delete driverData.charge_is_custom;

      await Driver.create(driverData);
      onDriverCreated(); // Refresh the list
      setOpen(false);
    } catch (error) {
      console.error("Failed to create driver:", error);
      // Here you could add user-facing error handling
    }
  };

  return (
    <>
      <style>{`
        .new-driver-modal-body { padding: 1.5rem 2rem; overflow-y: auto; max-height: 70vh; }
        .driver-profile-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e9ecef; }
        .driver-info { display: flex; align-items: center; gap: 1rem; }
        .driver-avatar { width: 60px; height: 60px; border-radius: 50%; background-color: #f1f5f9; display:flex; align-items:center; justify-content:center; }
        .driver-avatar .icon { color: #94a3b8; }
        .driver-details h4 { margin: 0; font-size: 1.25rem; font-weight: 500; }
        .driver-details span { color: #64748b; font-size: 0.9rem; }
        .driver-actions { display: flex; align-items: center; gap: 1rem; }
        .rating { color: #64748b; display: flex; align-items: center; gap: 0.2rem; }
        .icon-btn { background-color: #fef8e7; border: 1px solid #f0dca4; color: #212529; width: 40px; height: 40px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; display:flex; align-items:center; justify-content:center;}
        
        .form-section, .collapsible-section { margin-bottom: 2rem; }
        .form-section h5, .collapsible-section summary h5 { font-weight: 500; margin: 0 0 1.5rem 0; }
        .required { color: #dc3545; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.9rem; color: #64748b; }
        .form-group input, .form-group select { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 0.75rem; width: 100%; box-sizing: border-box; }
        
        details.collapsible-section { border-bottom: 1px solid #e9ecef; padding-bottom: 1rem; margin-bottom: 1rem; }
        details > summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        details > summary::-webkit-details-marker { display: none; }
        details > summary::after { content: '▼'; color: #64748b; transition: transform 0.2s; }
        details[open] > summary::after { transform: rotate(180deg); }
        .section-content { margin-top: 1.5rem; }

        .checkbox-group { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .checkbox-group label { font-weight: 500; font-size: 1rem; color: #212529; }
        
        .payment-section { margin-top: 1rem; }
        .payment-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
        .payment-inputs .form-group { margin-bottom: 0; }
        .payment-inputs input[disabled] { background-color: #e9ecef; cursor: not-allowed; opacity: 0.6; }
        
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; padding: 1.5rem 2rem; border-top: 1px solid #e9ecef; }
        .btn-save { background-color: #fdd85d; border: 1px solid #fdd85d; color: #212529; padding: 0.75rem 2rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .btn-cancel { background-color: #fef8e7; border: 1px solid #f0dca4; color: #212529; padding: 0.75rem 2rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
      `}</style>

      <main className="new-driver-modal-body">
        <div className="driver-profile-header">
          <div className="driver-info">
            <div className="driver-avatar"><User size={30} className="icon"/></div>
            <div className="driver-details">
              <h4>{formData.first_name || 'שם'} {formData.last_name || 'הנהג'}</h4>
              <span>{formData.phone || 'טלפון'} | {formData.residence_area || 'עיר'}</span>
            </div>
          </div>
          <div className="driver-actions">
            <div className="rating">
                <Star size={16} fill="#e5e7eb" stroke="none"/><Star size={16} fill="#e5e7eb" stroke="none"/><Star size={16} fill="#e5e7eb" stroke="none"/><Star size={16} fill="#e5e7eb" stroke="none"/><Star size={16} fill="#e5e7eb" stroke="none"/>
                <span>(0)</span>
            </div>
            <button className="icon-btn"><MessageSquare size={18}/></button>
          </div>
        </div>

        <form className="driver-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h5>פרטים אישיים <span className="required">*</span></h5>
            <div className="form-grid">
              <div className="form-group"><label>שם פרטי <span className="required">*</span></label><Input value={formData.first_name} onChange={e => handleChange('first_name', e.target.value)} /></div>
              <div className="form-group"><label>שם משפחה <span className="required">*</span></label><Input value={formData.last_name} onChange={e => handleChange('last_name', e.target.value)} /></div>
              <div className="form-group"><label>טלפון <span className="required">*</span></label><Input value={formData.phone} onChange={e => handleChange('phone', e.target.value)} /></div>
              <div className="form-group"><label>טלפון נוסף</label><Input value={formData.additional_phone} onChange={e => handleChange('additional_phone', e.target.value)} /></div>
              <div className="form-group"><label>כתובת <span className="required">*</span></label><Input value={formData.address} onChange={e => handleChange('address', e.target.value)} /></div>
              <div className="form-group"><label>עיר <span className="required">*</span></label><Input value={formData.residence_area} onChange={e => handleChange('residence_area', e.target.value)} /></div>
              <div className="form-group"><label>כתובת מייל <span className="required">*</span></label><Input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} /></div>
              <div className="form-group"><label>מספר ת.ז.</label><Input value={formData.id_number} onChange={e => handleChange('id_number', e.target.value)} /></div>
            </div>
            <div className="form-group" style={{marginTop: '1rem'}}>
              <label>שיוך לערוץ <span className="required">*</span></label>
              <Select value={formData.channel_id} onValueChange={value => handleChange('channel_id', value)}>
                  <SelectTrigger><SelectValue placeholder="בחר ערוץ" /></SelectTrigger>
                  <SelectContent>
                      {channels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.channel_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
          </section>

          <details className="collapsible-section" open>
            <summary><h5>פרטי רכב</h5></summary>
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group"><label>מספר רכב</label><Input value={formData.vehicle_license} onChange={e => handleChange('vehicle_license', e.target.value)} /></div>
                <div className="form-group"><label>סוג רכב</label><Input value={formData.vehicle_type} onChange={e => handleChange('vehicle_type', e.target.value)} /></div>
                <div className="form-group"><label>מספר מקומות</label><Input type="number" value={formData.vehicle_seats} onChange={e => handleChange('vehicle_seats', e.target.value)} /></div>
                <div className="form-group"><label>מצב הרכב</label><Input value={formData.vehicle_condition} onChange={e => handleChange('vehicle_condition', e.target.value)} /></div>
                <div className="form-group"><label>קטגוריה</label>
                    <Select value={formData.vehicle_category} onValueChange={value => handleChange('vehicle_category', value)}>
                        <SelectTrigger><SelectValue placeholder="בחר קטגוריה" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="private">פרטי</SelectItem>
                            <SelectItem value="commercial">מסחרי</SelectItem>
                            <SelectItem value="luxury">פאר</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
            </div>
          </details>
          
          <section className="form-section">
            <h5>תשלומים</h5>
            <div className="checkbox-group">
              <Checkbox id="default-charge" checked={formData.charge_is_default} onCheckedChange={checked => { handleChange('charge_is_default', checked); handleChange('charge_is_custom', !checked); }} />
              <label htmlFor="default-charge">ברירת מחדל</label>
            </div>
            <div className="checkbox-group">
              <Checkbox id="custom-charge" checked={formData.charge_is_custom} onCheckedChange={checked => { handleChange('charge_is_custom', checked); handleChange('charge_is_default', !checked); }}/>
              <label htmlFor="custom-charge">מותאם אישית</label>
            </div>
            <div className="payment-inputs">
              <div className="form-group"><label>חיוב קבוע (₪)</label><Input value={formData.fixed_charge} onChange={e => handleChange('fixed_charge', e.target.value)} disabled={formData.charge_is_default}/></div>
              <div className="form-group"><label>חיוב משתנה (%)</label><Input value={formData.variable_charge_percentage} onChange={e => handleChange('variable_charge_percentage', e.target.value)} disabled={formData.charge_is_default}/></div>
            </div>
          </section>
        </form>
      </main>

      <footer className="modal-footer">
        <button type="button" className="btn-cancel" onClick={() => setOpen(false)}>ביטול</button>
        <button type="submit" className="btn-save" onClick={handleSubmit}>שמור</button>
      </footer>
    </>
  );
} 