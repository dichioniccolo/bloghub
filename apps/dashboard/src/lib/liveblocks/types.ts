import type { UserInfo } from "liveblocks.config";

import type { Project, User } from "@acme/db";

export interface Document {
  // Equivalent to Liveblocks room id
  id: string;

  // The document's name
  name: string;

  // Arrays containing access levels
  accesses: DocumentAccesses;

  // The user if of the document's creator
  owner: DocumentUser["id"];

  // When the document was created (Date.toString())
  created: string;

  // When the last user connected (Date.toString())
  lastConnection: string;

  // If the room is a draft (which has no groups or public access) or not
  draft: boolean;

  // The type of document e.g. "canvas"
  type: DocumentType;
}

export type DocumentType = "text" | "whiteboard" | "spreadsheet";

export type DocumentGroup = Project & {
  access: DocumentAccess;
};

export type DocumentUser = User & {
  access: DocumentAccess;
  isCurrentUser: boolean;
};

export enum DocumentAccess {
  // Can edit, read, and modify invited users
  FULL = "full",

  // Can edit and read the document
  EDIT = "edit",

  // Can only read the document
  READONLY = "readonly",

  // Can't view the document
  NONE = "none",
}

export interface DocumentAccesses {
  default: DocumentAccess;
  groups: Record<DocumentGroup["id"], DocumentAccess>;
  users: Record<DocumentUser["id"], DocumentAccess>;
}

// Room metadata used when creating a new document
export interface DocumentRoomMetadata extends RoomMetadata {
  name: Document["name"];
  type: DocumentType;
  owner: string;
  draft: "yes" | "no";
}
export interface CustomText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Cursor = {
  name: string;
  color: string;
};

export interface Room {
  type: "room";
  id: string;
  metadata: DocumentRoomMetadata;
  defaultAccesses: RoomAccess[];
  groupsAccesses: RoomAccesses;
  usersAccesses: RoomAccesses;
  draft: "yes" | "no";
  createdAt?: string;
  lastConnectionAt: string;
}

export enum RoomAccess {
  RoomWrite = "room:write",
  RoomRead = "room:read",
  RoomPresenceWrite = "room:presence:write",
}

export enum RoomAccessLevels {
  USER = "user",
  GROUP = "group",
  DEFAULT = "default",
}

export type RoomMetadata = Record<string, string | string[]>;

export type RoomAccesses = Record<string, RoomAccess[] | null>;

export interface RoomActiveUser {
  type: "user";
  id: string;
  connectionId: number;
  info: UserInfo;
}

export interface GetDocumentsResponse {
  documents: Document[];
  nextPage: string | null;
}

export type GetStorageResponse = Record<string, unknown>;

export interface CreateDocumentRequest {
  name: Document["name"];
  type: DocumentType;
  userId: DocumentUser["id"];
  groupIds?: string; // Comma separated list of groupIds
  draft?: boolean;
}

export interface UpdateDocumentRequest {
  documentData: Partial<Room>;
}

export interface UpdateDocumentScope {
  access: DocumentAccess;
}

export interface UpdateGroupRequest {
  groupId: DocumentGroup["id"];
  access: DocumentAccess;
}

export interface RemoveGroupRequest {
  groupId: DocumentGroup["id"];
}

export interface UpdateUserRequest {
  userId: DocumentUser["id"];
  access: DocumentAccess;
}

export interface RemoveUserRequest {
  userId: DocumentUser["id"];
}

export interface GetRoomsResponse {
  nextPage: string | null;
  data: Room[];
}

export interface LiveUsersResponse {
  documentId: Document["id"];
  users: RoomActiveUser[];
}

export interface ErrorData {
  message: string;
  code?: number;
  suggestion?: string;
}

export type FetchApiResult<T = unknown> =
  | {
      data: T;
      error?: never;
    }
  | {
      error: ErrorData;
      data?: never;
    };
