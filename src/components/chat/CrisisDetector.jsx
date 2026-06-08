import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Button } from '../ui/button';

export default function CrisisDetector({ severity, message, onDismiss }) {
  if (!severity || severity === 'low') return null;

  const config = {
    critical: {
      bg: 'from-red-600 to-red-700',
      icon: AlertTriangle,
      title: 'Nous sommes inquiets pour toi',
      message: 'Ton message indique une détresse importante. Il est crucial de parler à quelqu\'un maintenant.',
      actions: [
        { label: '3114 - Urgence suicide', phone: '3114', primary: true },
        { label: '15 - SAMU', phone: '15', primary: false }
      ]
    },
    high: {
      bg: 'from-orange-500 to-red-500',
      icon: AlertTriangle,
      title: 'On est là pour toi',
      message: 'Tu sembles traverser un moment difficile. Un professionnel peut vraiment t\'aider.',
      actions: [
        { label: 'Voir les professionnels', link: 'Professionnels', primary: true }
      ]
    },
    medium: {
      bg: 'from-yellow-500 to-orange-400',
      icon: Heart,
      title: 'Prends soin de toi',
      message: 'N\'hésite pas à consulter un professionnel si tu en ressens le besoin.',
      actions: [
        { label: 'Découvrir les ressources', link: 'Professionnels', primary: false }
      ]
    }
  };

  const alert = config[severity] || config.medium;
  const Icon = alert.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-gradient-to-r ${alert.bg} rounded-[24px] p-5 mb-4 text-white relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-start space-x-4 mb-4">
          <motion.div
            animate={{ 
              scale: severity === 'critical' ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              duration: 1, 
              repeat: severity === 'critical' ? Infinity : 0 
            }}
            className="w-12 h-12 rounded-[16px] bg-white/20 backdrop-blur-lg flex items-center justify-center flex-shrink-0"
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{alert.title}</h3>
            <p className="text-sm text-white/90 leading-relaxed">{alert.message}</p>
          </div>
        </div>

        <div className="space-y-2">
          {alert.actions.map((action, index) => (
            action.phone ? (
              <a
                key={index}
                href={`tel:${action.phone}`}
                className={`flex items-center justify-center space-x-2 w-full h-11 rounded-[16px] font-semibold transition-all ${
                  action.primary
                    ? 'bg-white text-red-600 hover:bg-white/90'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{action.label}</span>
              </a>
            ) : (
              <Link key={index} to={createPageUrl(action.link)}>
                <button
                  className={`flex items-center justify-center space-x-2 w-full h-11 rounded-[16px] font-semibold transition-all ${
                    action.primary
                      ? 'bg-white text-[#2E4057] hover:bg-white/90'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <span>{action.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            )
          ))}
        </div>

        {onDismiss && severity !== 'critical' && (
          <button
            onClick={onDismiss}
            className="text-xs text-white/70 hover:text-white underline mt-3 w-full text-center"
          >
            Fermer ce message
          </button>
        )}
      </div>
    </motion.div>
  );
}