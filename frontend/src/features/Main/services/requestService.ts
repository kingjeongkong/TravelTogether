import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Request, RequestUserProfile } from '../types/requestTypes';

export const requestService = {
  async sendRequest(
    currentLoggedInUserID: string,
    receiverID: string,
    message?: string
  ): Promise<boolean> {
    try {
      const newRequest = {
        senderID: currentLoggedInUserID,
        receiverID,
        status: 'pending',
        message,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'requests'), newRequest);
      return true; // ToDo : 성공 시 UI 알림 처리
    } catch (error) {
      console.error('Error sending request:', error);
      return false; // ToDo : 실패 시 UI 알림 처리
    }
  },

  async getMyRequests(
    currentLoggedInUserID: string
  ): Promise<(Request & { sender: RequestUserProfile })[]> {
    try {
      const requestsQuery = query(
        collection(db, 'requests'),
        where('receiverID', '==', currentLoggedInUserID),
        where('status', '==', 'pending')
      );
      const requestsSnapshot = await getDocs(requestsQuery);

      const requests = await Promise.all(
        requestsSnapshot.docs.map(async (requestDoc) => {
          const request = { id: requestDoc.id, ...requestDoc.data() } as Request;
          const senderDoc = await getDoc(doc(db, 'users', request.senderID));
          const senderData = senderDoc.data() as RequestUserProfile;

          return {
            ...request,
            sender: senderData
          };
        })
      );

      return requests;
    } catch (error) {
      //ToDo : 에러 처리
      console.error('Error fetching requests:', error);
      throw new Error('Failed to fetch requests');
      return [];
    }
  },

  async acceptRequest(requestID: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'requests', requestID), {
        status: 'accepted'
      });
      return true; // ToDo :성공 시 UI 알림 처리
    } catch (error) {
      console.error('Error accepting request:', error);
      return false; // ToDo : 실패 시 UI 알림 처리
    }
  },

  async declineRequest(requestID: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'requests', requestID), {
        status: 'declined'
      });
      return true; // ToDo :성공 시 UI 알림 처리
    } catch (error) {
      console.error('Error declining request:', error);
      return false; // ToDo : 실패 시 UI 알림 처리
    }
  },

  async checkExistingRequest(userID: string, otherUserID: string): Promise<boolean> {
    try {
      const sentRequestQuery = query(
        collection(db, 'requests'),
        where('senderID', '==', userID),
        where('receiverID', '==', otherUserID),
        where('status', '==', 'pending')
      );

      const receivedRequestQuery = query(
        collection(db, 'requests'),
        where('senderID', '==', otherUserID),
        where('receiverID', '==', userID),
        where('status', '==', 'pending')
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentRequestQuery),
        getDocs(receivedRequestQuery)
      ]);

      return !sentSnapshot.empty || !receivedSnapshot.empty;
    } catch (error) {
      console.error('Error checking existing request:', error);
      return false; // ToDo : 실패 시 UI 알림 처리
    }
  }
};