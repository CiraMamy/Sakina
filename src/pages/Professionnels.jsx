import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Video, Clock, Star, AlertCircle, Heart } from 'lucide-react';
import { base44 } from '../api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button';

const ProfessionalCard = ({ professional, onContact }) => {
  const specialtyColors = {
    Psychologue: 'from-blue-500 to-cyan-500',
    Psychiatre: 'from-purple-500 to-indigo-500',
    Thérapeute: 'from-green-500 to-teal-500',
    Coach: 'from-orange-500 to-yellow-500',
    Addictologue: 'from-red-500 to-pink-500',
    Urgences: 'from-red-600 to-red-800'
  };

  const gradient = specialtyColors[professional.specialty] || 'from-gray-500 to-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-[24px] p-5 card-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg`}>
            {professional.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-[#2E4057] text-lg">{professional.name}</h3>
            <p className="text-sm text-[#8CB8E8] font-medium">{professional.specialty}</p>
          </div>
        </div>
        {professional.rating && (
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" fill="#EAB308" />
            <span className="text-sm font-semibold text-gray-700">{professional.rating}</span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{professional.description}</p>

      <div className="space-y-2 mb-4">
        {professional.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-[#8CB8E8]" />
            <a href={`tel:${professional.phone}`} className="hover:text-[#8CB8E8]">{professional.phone}</a>
          </div>
        )}
        {professional.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-[#8CB8E8]" />
            <a href={`mailto:${professional.email}`} className="hover:text-[#8CB8E8]">{professional.email}</a>
          </div>
        )}
        {professional.address && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-[#8CB8E8]" />
            <span>{professional.address}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {professional.online_consultation && (
          <span className="flex items-center space-x-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-[12px]">
            <Video className="w-3 h-3" />
            <span>En ligne</span>
          </span>
        )}
        {professional.accepts_emergency && (
          <span className="flex items-center space-x-1 text-xs bg-red-50 text-red-700 px-3 py-1 rounded-[12px]">
            <AlertCircle className="w-3 h-3" />
            <span>Urgences</span>
          </span>
        )}
        {professional.availability && (
          <span className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-[12px]">
            <Clock className="w-3 h-3" />
            <span>{professional.availability}</span>
          </span>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={() => window.open(`tel:${professional.phone}`)}
          className="flex-1 h-10 rounded-[16px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg"
        >
          <Phone className="w-4 h-4 mr-2" />
          Appeler
        </Button>
        {professional.online_consultation && (
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-[16px]"
          >
            <Video className="w-4 h-4 mr-2" />
            Consultation
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default function Professionnels() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const { data: professionals = [] } = useQuery({
    queryKey: ['professionals'],
    queryFn: () => base44.entities.HealthProfessional.list()
  });

  const specialties = ['all', 'Psychologue', 'Psychiatre', 'Thérapeute', 'Coach', 'Addictologue', 'Urgences'];

  const filteredProfessionals = selectedSpecialty === 'all'
    ? professionals
    : professionals.filter(p => p.specialty === selectedSpecialty);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-8 rounded-b-[48px]">
        <h1 className="text-3xl font-bold text-white mb-2">Professionnels</h1>
        <p className="text-white/80 font-light">Trouvez le soutien qu'il vous faut</p>
      </div>

      <div className="px-6 mt-6">
        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-[20px] p-5 mb-6 text-white"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-[16px] bg-white/20 backdrop-blur-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">En cas d'urgence</h3>
              <p className="text-sm text-white/90 mb-3">
                Si vous êtes en détresse immédiate, contactez :
              </p>
              <div className="space-y-2">
                <a href="tel:3114" className="flex items-center space-x-2 text-sm font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>3114 - Numéro national de prévention du suicide</span>
                </a>
                <a href="tel:15" className="flex items-center space-x-2 text-sm font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>15 - SAMU (urgences médicales)</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specialty Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Spécialités</h3>
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-[16px] text-sm font-medium whitespace-nowrap transition-all ${
                  selectedSpecialty === specialty
                    ? 'bg-[#8CB8E8] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {specialty === 'all' ? 'Tous' : specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Professionals List */}
        <div className="space-y-4">
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map((professional, index) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun professionnel trouvé</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#CFE2F3] to-[#E8F4F8] rounded-[20px] p-5 mt-6"
        >
          <h3 className="font-bold text-[#2E4057] mb-2">💙 Tu n'es pas seul(e)</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Consulter un professionnel est un acte de courage et de bienveillance envers soi-même. 
            Sakina peut t'accompagner au quotidien, mais un suivi professionnel peut faire toute la différence.
          </p>
        </motion.div>
      </div>
    </div>
  );
}