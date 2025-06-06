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
import { toast } from 'react-toastify';

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
      toast.success('Request sent successfully');

      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error sending request:', error);
      }
      toast.error('Failed to send request. Please try again.');
      return false;
    }
  },

  async getMyRequests(
    currentLoggedInUserID: string
  ): Promise<(Request & { sender: RequestUserProfile })[]> {
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
  },

  async acceptRequest(requestID: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'requests', requestID), {
        status: 'accepted'
      });
      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error accepting request:', error);
      }
      toast.error('Failed to accept request. Please try again.');
      return false;
    }
  },

  async declineRequest(requestID: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'requests', requestID), {
        status: 'declined'
      });
      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error declining request:', error);
      }
      toast.error('Failed to decline request. Please try again.');
      return false;
    }
  },

  async checkRequestByStatus(
    userID: string,
    otherUserID: string,
    status: 'pending' | ['accepted', 'declined']
  ): Promise<boolean> {
    const statusCondition = Array.isArray(status)
      ? where('status', 'in', status)
      : where('status', '==', status);

    const sentRequestQuery = query(
      collection(db, 'requests'),
      where('senderID', '==', userID),
      where('receiverID', '==', otherUserID),
      statusCondition
    );

    const receivedRequestQuery = query(
      collection(db, 'requests'),
      where('senderID', '==', otherUserID),
      where('receiverID', '==', userID),
      statusCondition
    );

    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentRequestQuery),
      getDocs(receivedRequestQuery)
    ]);

    return !sentSnapshot.empty || !receivedSnapshot.empty;
  },

  async reverRequestStatus(requestID: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'requests', requestID), {
        status: 'pending'
      });
      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error reverting request status:', error);
      }
      return false;
    }
  },

  async createChatRoom(participants: string[]): Promise<string | null> {
    try {
      const newChatRoom = {
        participants,
        createdAt: new Date().toISOString(),
        lastMessage: '',
        lastMessageTime: new Date().toISOString()
      };

      const chatRoomRef = await addDoc(collection(db, 'chatRooms'), newChatRoom);
      toast.success('Chat Room created successfully');

      return chatRoomRef.id;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating chat room:', error);
      }
      toast.error('Failed to create chat room. Please accept the request again.');
      return null;
    }
  }
};
