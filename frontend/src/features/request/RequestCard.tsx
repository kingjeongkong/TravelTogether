import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { requestService } from '../shared/services/requestService';
import { Request, RequestUserProfile } from '../shared/types/requestTypes';
import { formatHashTags } from '../shared/utils/HashTags';

interface RequestCardProps {
  request: Request & { sender: RequestUserProfile };
}

const RequestCard = ({ request }: RequestCardProps) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const isFetching = useIsFetching({ queryKey: ['requests', user?.uid] });
  const isLoading = isProcessing || isFetching > 0;

  const onStatusChange = () => {
    queryClient.invalidateQueries({ queryKey: ['requests', user?.uid] });
  };

  const updateTravelerCard = () => {
    queryClient.invalidateQueries({
      queryKey: [
        'nearbyUsers',
        user?.uid,
        request.sender.location.city,
        request.sender.location.state
      ]
    });
  };

  const handleAccept = async () => {
    setIsProcessing(true);

    // 1. Request 수락
    const success = await requestService.acceptRequest(request.id);
    if (!success) return;

    // 2. Chat Room 생성
    const chatRoomID = await requestService.createChatRoom([
      request.senderID,
      request.receiverID
    ]);

    if (chatRoomID) {
      onStatusChange();
      updateTravelerCard();
    } else {
      // ChatRoom 생성 실패 시 request 상태 pending으로 복구
      await requestService.reverRequestStatus(request.id);
    }

    setIsProcessing(false);
  };

  const handleDecline = async () => {
    setIsProcessing(true);

    const success = await requestService.declineRequest(request.id);
    if (success) {
      onStatusChange();
      updateTravelerCard();
    }

    setIsProcessing(false);
  };

  return (
    <div className="overflow-hidden flex flex-col h-full px-5 py-4 bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl md:px-8 md:py-6">
      <div className="flex">
        <img
          src={request.sender.image || ''}
          className="w-12 h-12 rounded-full mr-2 md:w-16 md:h-16 md:mr-4"
        />
        <div className="flex flex-col justify-center">
          <span className="text-base font-medium text-gray-800 md:text-lg line-clamp-1">
            {request.sender.name || ''}
          </span>
          <span className="text-sm text-orange-400 md:text-base line-clamp-1">
            {formatHashTags(request.sender.tags || '')}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 text-center mt-3 md:text-base">
        Request Message
      </p>

      <p className="flex-grow px-2 text-sm text-center text-gray-700 line-clamp-4 mt-1 mb-5 md:text-base">
        {request.message || ''}
      </p>

      <div className="flex gap-3">
        <button
          className="w-full py-2 text-white bg-green-600 rounded-3xl shadow-sm hover:bg-green-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleAccept}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Accept'}
        </button>

        <button
          className="w-full py-2 text-white bg-red-600 rounded-3xl shadow-sm hover:bg-red-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleDecline}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Decline'}
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
