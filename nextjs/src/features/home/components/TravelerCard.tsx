'use client';

import LoadingIndicator from '@/components/LoadingIndicator';
import RequestModal from '@/features/home/components/RequestModal';
import useProfile from '@/features/home/hooks/useProfile';
import { useSendRequest } from '@/features/home/hooks/useSendRequest';
import { formatHashTags } from '@/features/shared/utils/HashTags';
import Image from 'next/image';
import { useState } from 'react';

interface TravelCardProps {
  travelerID: string;
  imageURL?: string;
  name?: string;
  bio?: string;
  tags?: string;
}

const TravelerCard = ({ travelerID, imageURL, name, bio, tags }: TravelCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profile } = useProfile(travelerID);
  const { sendRequest, isRequestSent, isLoading } = useSendRequest(travelerID);

  const handleSendRequest = async (message: string) => {
    try {
      await sendRequest(message);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error sending request:', error);
      // TODO: 에러 처리 (예: 토스트 메시지)
    }
  };

  return (
    <>
      <div className="overflow-hidden flex flex-col h-full px-4 py-3 bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl md:px-8 md:py-6">
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
          onClick={() => setIsModalOpen(true)}
          disabled={isRequestSent || isLoading}
        >
          {isLoading && <LoadingIndicator color="#ffffff" size={16} />}
          {isLoading ? 'Loading...' : isRequestSent ? 'Request Pending' : 'Send Request'}
        </button>
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendRequest}
        receiverName={profile?.name || name || 'Traveler'}
      />
    </>
  );
};

export default TravelerCard;
