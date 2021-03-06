import axios from '../config/axios';
import { DOCUMENT_HISTORY } from '../constants/uris';
import {
  COLLABORATION_REQUESTS,
  DOCUMENT,
  DOCUMENT_BY_ID,
  DOCUMENT_BY_OWNER,
  DOCUMENT_SNAPSHOT,
  FAVORITE_BY_ID,
} from './../constants/uris';

export const createDocumentMutation = async (payload: any): Promise<string> => {
  const { data } = await axios.post(DOCUMENT, payload);
  return data;
};

export const getDocumentsByOwner = async (key: any, id: string): Promise<any> => {
  const { data } = await axios.get(DOCUMENT_BY_OWNER(id));
  return data;
};

export const getDocumentsFavoris = async (key: any, id: string): Promise<any> => {
  const { data } = await axios.get(FAVORITE_BY_ID(id));
  return data;
};

export const getDocumentById = async (key: any, id: string): Promise<any> => {
  const { data } = await axios.get(DOCUMENT_BY_ID(id));
  return data;
};

export const deleteDocumentMutation = async (payload: any): Promise<string> => {
  const { data } = await axios.delete(DOCUMENT_BY_ID(payload));
  return data;
};
export const updateDocumentMutation = async ({ id, body }: any): Promise<string> => {
  const { data } = await axios.put(DOCUMENT_BY_ID(id), body);
  return data;
};

export const getCollaborationRequests = async (key: any, id: string): Promise<any> => {
  const { data } = await axios.get(COLLABORATION_REQUESTS);
  return data;
};

export const getDocumentHistory = async (key: any, id: string): Promise<any> => {
  const { data } = await axios.get(DOCUMENT_HISTORY(id));
  return data;
};

export const getDocumentSnapshot = async (key: any, { docId, histId }: any): Promise<any> => {
  const { data } = await axios.get(DOCUMENT_SNAPSHOT(docId, histId));
  return data;
};
