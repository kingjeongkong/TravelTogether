import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { requestService } from '../../shared/services/requestService';
import { formatHashTags } from '../../shared/utils/HashTags';
import RequestModal from './RequestModal';

interface TravelCardProps {
  travelerID: string;
  image?: string;
  name?: string;
  bio?: string;
  tags?: string;
}

const TravelerCard = ({ travelerID, image, name, bio, tags }: TravelCardProps) => {
  const user = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: hasExistingRequest = false, refetch: updateExistingRequest } = useQuery({
    queryKey: ['existingRequest', user?.uid, travelerID],
    queryFn: async () =>
      await requestService.checkRequestByStatus(user!.uid, travelerID, 'pending'),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const handleSendRequest = async (message?: string) => {
    if (!user) return;

    const success = await requestService.sendRequest(user.uid, travelerID, message);
    if (success) {
      updateExistingRequest();
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <div className="overflow-hidden flex flex-col h-full px-4 py-3 bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl md:px-8 md:py-6">
        <div className="flex">
          <img
            src={image || ''}
            className="flex-shrink-0 w-12 h-12 rounded-full mr-2 md:w-16 md:h-16 md:mr-4"
          />
          <div className="flex flex-col justify-center">
            <span className="text-base font-medium text-gray-800 md:text-lg line-clamp-1">
              {name || ''}
            </span>
            <span className="text-xs text-orange-400 md:text-base line-clamp-1">
              {formatHashTags(tags || '')}
            </span>
          </div>
        </div>

        <p className="flex-grow text-sm text-gray-700 line-clamp-4 mt-3 mb-5 md:text-base">
          {bio}
        </p>

        <button
          className="w-full py-2 text-white bg-orange-500 rounded-3xl shadow-sm hover:bg-orange-600 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => setIsModalOpen(true)}
          disabled={hasExistingRequest}
        >
          {hasExistingRequest ? 'Request Pending' : 'Send Request'}
        </button>
      </div>

      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendRequest}
        receiverName={name || 'Traveler'}
      />
    </>
  );
};

export default TravelerCard;
