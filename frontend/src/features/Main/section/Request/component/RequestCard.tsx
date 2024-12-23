import { useState } from 'react';
import googleLogo from '../../../../../assets/google-logo.png';
import { Request, RequestUserProfile } from '../../../types/requestTypes';
import { requestService } from '../../../services/requestService';
import { formatHashTags } from '../../../utils/HashTags';

interface RequestCardProps {
  request: Request & { sender: RequestUserProfile };
  onStatusChange: () => void;
}

const RequestCard = ({ request, onStatusChange }: RequestCardProps) => {
  const [isloading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const success = await requestService.acceptRequest(request.id);
      if (success) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      // ToDo : 실패 시 UI 알림 처리
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      const success = await requestService.declineRequest(request.id);
      if (success) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error declining request:', error);
      // ToDo : 실패 시 UI 알림 처리
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden flex flex-col h-full px-5 py-4 bg-white rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-xl md:px-8 md:py-6">
      <div className="flex">
        <img
          src={request.sender.photoURL || ''}
          className="w-10 h-10 rounded-full mr-2 md:w-12 md:h-12 md:mr-4"
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
          disabled={isloading}
        >
          {isloading ? 'Processing...' : 'Accept'}
        </button>

        <button
          className="w-full py-2 text-white bg-red-600 rounded-3xl shadow-sm hover:bg-red-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleDecline}
          disabled={isloading}
        >
          {isloading ? 'Processing...' : 'Decline'}
        </button>
      </div>
    </div>
  );
};

export default RequestCard;