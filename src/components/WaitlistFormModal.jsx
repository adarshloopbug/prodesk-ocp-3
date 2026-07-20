import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, AlertCircle, ShieldCheck } from 'lucide-react';
import { sanitizeInput, isValidEmail } from '../utils/sanitizer';

export default function WaitlistFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingEntry = null 
}) {
  const isEditing = Boolean(editingEntry);

  const [formData, setFormData] = useState({
    title: '',
    gamerTag: '',
    email: '',
    genre: 'Action RPG',
    platform: 'PC',
    status: 'PENDING',
    priorityScore: 50,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        title: editingEntry.title || '',
        gamerTag: editingEntry.gamerTag || '',
        email: editingEntry.email || '',
        genre: editingEntry.genre || 'Action RPG',
        platform: editingEntry.platform || 'PC',
        status: editingEntry.status || 'PENDING',
        priorityScore: editingEntry.priorityScore || 50,
        notes: editingEntry.notes || ''
      });
    } else {
      setFormData({
        title: '',
        gamerTag: '',
        email: '',
        genre: 'Action RPG',
        platform: 'PC',
        status: 'PENDING',
        priorityScore: 50,
        notes: ''
      });
    }
    setErrors({});
    setAttemptedSubmit(false);
    setIsSubmitting(false);
  }, [editingEntry, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Game Title is required.";
    }

    if (!formData.gamerTag.trim()) {
      newErrors.gamerTag = "GamerTag is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format (e.g. user@domain.com).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const sanitizedPayload = {
        ...formData,
        title: sanitizeInput(formData.title),
        gamerTag: sanitizeInput(formData.gamerTag),
        email: sanitizeInput(formData.email),
        notes: sanitizeInput(formData.notes)
      };

      await onSubmit(sanitizedPayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (attemptedSubmit) {
      setErrors(prev => {
        const updated = { ...prev };
        if (field === 'title' && value.trim()) delete updated.title;
        if (field === 'gamerTag' && value.trim()) delete updated.gamerTag;
        if (field === 'email' && isValidEmail(value)) delete updated.email;
        return updated;
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-form-title"
    >
      <div className="mono-card w-full max-w-xl overflow-hidden shadow-2xl space-y-0 border-zinc-700 animate-in fade-in zoom-in duration-150">
        
        <div className="p-4 sm:p-6 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg">
              {isEditing ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 id="modal-form-title" className="text-lg font-bold text-white">
                {isEditing ? `Edit Entry (PUT /games/${editingEntry.id})` : 'New Waitlist Entry (POST /games)'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isEditing ? 'Update details using backend route parameter :id' : 'Create game waitlist entry with XSS sanitization'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
            aria-label="Close modal form"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {attemptedSubmit && Object.keys(errors).length > 0 && (
            <div 
              className="p-3 bg-red-950/80 border border-red-800 rounded-md text-red-200 text-xs flex items-center gap-2"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Form contains invalid fields. Correct highlighted errors below before submitting.</span>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="field-title" className="text-xs font-semibold text-zinc-200">
              Game Title <span className="text-red-400">*</span>
            </label>
            <input
              id="field-title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Cyberpunk Odyssey 2077"
              className={`mono-input ${errors.title ? 'mono-input-invalid' : ''}`}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'error-title' : undefined}
              required
            />
            {errors.title && (
              <p id="error-title" className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="field-gamerTag" className="text-xs font-semibold text-zinc-200">
                GamerTag <span className="text-red-400">*</span>
              </label>
              <input
                id="field-gamerTag"
                type="text"
                value={formData.gamerTag}
                onChange={(e) => handleChange('gamerTag', e.target.value)}
                placeholder="e.g. CyberNinja_99"
                className={`mono-input ${errors.gamerTag ? 'mono-input-invalid' : ''}`}
                aria-invalid={Boolean(errors.gamerTag)}
                aria-describedby={errors.gamerTag ? 'error-gamerTag' : undefined}
                required
              />
              {errors.gamerTag && (
                <p id="error-gamerTag" className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.gamerTag}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="field-email" className="text-xs font-semibold text-zinc-200">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                id="field-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g. player@esports.com"
                className={`mono-input ${errors.email ? 'mono-input-invalid' : ''}`}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'error-email' : undefined}
                required
              />
              {errors.email && (
                <p id="error-email" className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="field-genre" className="text-xs font-semibold text-zinc-200">
                Genre
              </label>
              <select
                id="field-genre"
                value={formData.genre}
                onChange={(e) => handleChange('genre', e.target.value)}
                className="mono-input font-mono text-xs"
              >
                <option value="Action RPG">Action RPG</option>
                <option value="MMORPG">MMORPG</option>
                <option value="Tactical Shooter">Tactical Shooter</option>
                <option value="Soulslike">Soulslike</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="field-platform" className="text-xs font-semibold text-zinc-200">
                Platform
              </label>
              <select
                id="field-platform"
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="mono-input font-mono text-xs"
              >
                <option value="PC">PC</option>
                <option value="Console">Console</option>
                <option value="PC / Console">PC / Console</option>
                <option value="Cross-platform">Cross-platform</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="field-status" className="text-xs font-semibold text-zinc-200">
                Status
              </label>
              <select
                id="field-status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="mono-input font-mono text-xs"
              >
                <option value="PENDING">PENDING</option>
                <option value="INVITED">INVITED</option>
                <option value="APPROVED">APPROVED</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="field-priorityScore" className="text-xs font-semibold text-zinc-200 flex justify-between">
                <span>Priority Score</span>
                <span className="font-mono text-zinc-400">{formData.priorityScore}/100</span>
              </label>
              <input
                id="field-priorityScore"
                type="range"
                min="0"
                max="100"
                value={formData.priorityScore}
                onChange={(e) => handleChange('priorityScore', e.target.value)}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white mt-3"
                aria-label="Priority Score range"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="field-notes" className="text-xs font-semibold text-zinc-200">
              Notes & Comments
            </label>
            <textarea
              id="field-notes"
              rows={2}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Pre-ordered deluxe edition, streamer partner, etc."
              className="mono-input text-xs"
            />
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md text-[11px] text-zinc-400 flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Inputs sanitized against XSS injection before delivery to Express REST API.</span>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="mono-btn-secondary text-xs"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mono-btn-primary text-xs"
              aria-label={isEditing ? 'Save changes to game waitlist entry' : 'Create game waitlist entry'}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                isEditing ? 'Save Changes (PUT)' : 'Create Entry (POST)'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
