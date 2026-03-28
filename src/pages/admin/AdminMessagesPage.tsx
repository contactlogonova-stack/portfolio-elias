import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle2, Trash2, X, Mail, MailOpen, Calendar } from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';
import type { Message } from '../../lib/database.types';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { staggerContainer, fadeInUp } from '../../lib/animations';

export default function AdminMessagesPage() {
  const {
    messages,
    loading,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteMessage
  } = useMessages();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.is_read;
    if (filter === 'read') return msg.is_read;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date).replace(':', 'h');
  };

  const handleOpenMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      markAsRead(msg.id);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleToggleRead = (e: React.MouseEvent, msg: Message) => {
    e.stopPropagation();
    if (msg.is_read) {
      markAsUnread(msg.id);
    } else {
      markAsRead(msg.id);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-title font-bold text-primary-900 flex items-center gap-3">
              Messages reçus
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-neutral-500">Gérez vos demandes de contact</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm w-fit border border-neutral-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-primary-800 text-white' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread' 
              ? 'bg-primary-800 text-white' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Non lus
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'read' 
              ? 'bg-primary-800 text-white' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Lus
        </button>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Aucun message</h3>
          <p className="text-neutral-500">
            {filter === 'all' 
              ? "Vous n'avez pas encore reçu de message." 
              : filter === 'unread' 
                ? "Vous n'avez aucun message non lu." 
                : "Vous n'avez aucun message lu."}
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredMessages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={fadeInUp}
              onClick={() => handleOpenMessage(msg)}
              className={`relative bg-white rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:shadow-md group flex flex-col sm:flex-row gap-4 sm:items-center ${
                !msg.is_read ? 'border-primary-200 shadow-sm' : 'border-neutral-200 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Status Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                !msg.is_read ? 'bg-primary-500' : 'bg-neutral-300'
              }`} />

              {/* Content */}
              <div className="flex-1 pl-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-bold ${!msg.is_read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                      {msg.name}
                    </h3>
                    <span className="text-sm text-neutral-500 hidden sm:inline-block">•</span>
                    <span className="text-sm text-neutral-500 truncate max-w-[200px]">{msg.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {!msg.is_read && (
                      <Badge variant="red" className="text-xs py-0.5">Non lu</Badge>
                    )}
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>
                <h4 className={`text-sm mb-1 ${!msg.is_read ? 'font-bold text-primary-800' : 'font-medium text-neutral-800'}`}>
                  {msg.subject}
                </h4>
                <p className="text-sm text-neutral-500 truncate max-w-3xl">
                  {msg.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pt-4 sm:pt-0 border-t sm:border-0 border-neutral-100">
                <button
                  onClick={(e) => handleToggleRead(e, msg)}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  title={msg.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
                >
                  {msg.is_read ? <Mail size={18} /> : <MailOpen size={18} />}
                </button>
                <button
                  onClick={(e) => handleDelete(e, msg.id)}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
              onClick={() => setSelectedMessage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="sticky top-0 bg-white border-b border-neutral-100 p-4 sm:p-6 flex items-center justify-between z-10 shrink-0">
                <h2 className="text-lg sm:text-xl font-bold text-primary-900">Détails du message</h2>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
                <div className="bg-neutral-50 rounded-xl p-6 mb-8 border border-neutral-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">De</p>
                      <p className="font-medium text-neutral-900">{selectedMessage.name}</p>
                      <a href={`mailto:${selectedMessage.email}`} className="text-primary-600 hover:underline text-sm">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="font-medium text-neutral-900 flex items-center gap-2">
                        <Calendar size={16} className="text-neutral-400" />
                        {formatDate(selectedMessage.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-primary-800 mb-2">
                    {selectedMessage.subject}
                  </h3>
                  <div className="w-12 h-1 bg-accent-500 rounded-full"></div>
                </div>

                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-200 p-6 flex justify-end gap-3 z-10">
                <Button 
                  variant="outline" 
                  onClick={(e) => handleDelete(e, selectedMessage.id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 border-transparent hover:border-red-200"
                >
                  Supprimer
                </Button>
                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                  <Button variant="primary" className="flex items-center gap-2">
                    <Mail size={18} />
                    Répondre
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
