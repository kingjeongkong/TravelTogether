'use client';

import LoadingIndicator from '@/components/LoadingIndicator';
import RequestModal from '@/features/home/components/RequestModal';
import useUserProfileById from '@/features/home/hooks/useProfile';
import { useSendRequest } from '@/features/home/hooks/useSendRequest';
import { getDistanceText } from '@/features/home/utils/location';
import TravelerDetailModal from '@/features/shared/components/TravelerDetailModal';
import { formatHashTags } from '@/features/shared/utils/HashTags';
import Image from 'next/image';
import { useState } from 'react';

interface TravelCardProps {
  travelerId: string;
  imageURL?: string;
  name?: string;
  bio?: string;
  tags?: string;
  distance?: number;
  onRequestSent?: (travelerID: string) => void;
}

const TravelerCard = ({
  travelerId,
  imageURL,
  name,
  bio,
  tags,
  distance,
  onRequestSent,
}: TravelCardProps) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { profile } = useUserProfileById(travelerId);
  const { sendRequest, isLoading } = useSendRequest(travelerId);

  const handleSendRequest = async (message: string) => {
    try {
      await sendRequest(message);
      setIsRequestModalOpen(false);
      onRequestSent?.(travelerId);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const distanceText = getDistanceText(distance);

  return (
    <>
      <div
        className="relative overflow-hidden flex flex-col h-full px-4 py-3 bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl md:px-8 md:py-6 cursor-pointer transition-all duration-200"
        onClick={() => setIsDetailModalOpen(true)}
      >
        {distanceText && (
          <div className="absolute top-5 right-7 z-10 text-xs text-gray-600">{distanceText}</div>
        )}

        <div className="flex">
          <Image
            src={profile?.image || imageURL || '/default-traveler.png'}
            width={64}
            height={64}
            className="flex-shrink-0 w-12 h-12 rounded-full mr-2 md:w-16 md:h-16 md:mr-4"
            alt={profile?.name || name || 'Traveler'}
          />
          <div className="flex flex-col justify-center">
            <span className="text-base font-medium text-gray-800 md:text-lg line-clamp-1">
              {profile?.name || name || ''}
            </span>
            <span className="text-xs text-orange-400 md:text-base line-clamp-1">
              {formatHashTags(profile?.tags || tags || '')}
            </span>
          </div>
        </div>

        <p className="flex-grow text-sm text-gray-700 line-clamp-4 mt-3 mb-5 md:text-base">
          {profile?.bio || bio}
        </p>

        <button
          className="w-full py-2 text-white bg-orange-500 rounded-3xl shadow-sm hover:bg-orange-600 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsRequestModalOpen(true);
          }}
          disabled={isLoading}
          aria-label={
            isLoading
              ? `Loading request to ${profile?.name || name || 'traveler'}`
              : `Send request to ${profile?.name || name || 'traveler'}`
          }
        >
          {isLoading && <LoadingIndicator color="#ffffff" size={16} />}
          {isLoading ? 'Loading...' : 'Send Request'}
        </button>
      </div>

      <TravelerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        travelerId={travelerId}
        distance={distance}
        showRequestButton={true}
      />

      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleSendRequest}
        receiverName={profile?.name || name || 'Traveler'}
      />
    </>
  );
};

export default TravelerCard;
