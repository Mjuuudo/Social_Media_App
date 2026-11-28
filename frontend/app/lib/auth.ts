import { apiFetch } from "./api"


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";


export type LoginData = {
  // Username or email
  identifier: string;
  password: string;
};

export type RegisterData = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

// Mirrors the backend `loggedInUser` schema returned by `GET /api/auth/me`.
// UUIDs and datetimes arrive as strings in JSON (datetimes are ISO 8601).
export type User = {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    bio: string | null;
    location: string | null;
    job_title: string | null;
    avatar_key: string | null;
    cover_key: string | null;
    is_private: boolean;
    created_at: string;
    updated_at: string;
    last_seen_at: string | null;
};

// Mirrors the backend `UserSettings` schema returned by `GET /api/auth/settings`.
// Each flag turns one kind of notification on (true) or off (false).
export type UserSettings = {
    user_id: string;
    notify_reactions: boolean;
    notify_comments: boolean;
    notify_follows: boolean;
    notify_messages: boolean;
    weekly_digest: boolean;
};

// Mirrors the backend `UpdateProfileRequest` schema for `PATCH /api/auth/me`.
// Every field is optional: only the fields you send get updated.
// first_name, last_name and is_private must not be sent as null.
export type UpdateProfileData = {
    first_name?: string;
    last_name?: string;
    bio?: string | null;
    location?: string | null;
    job_title?: string | null;
    is_private?: boolean;
};


export async function Login ( data: LoginData ) {
    const response = await fetch ( `${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(data)
    });
    
    return response;
}

export async function Register ( data: RegisterData ) {
    const response = await fetch ( `${ API_URL }/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    return response;
}

export async function loadProfile( ){
    const path = "api/auth/me"

    const response = await apiFetch(path, { method: "GET", credentials: "include"} )


    return response;
}

// GET /api/auth/settings: the logged-in user's notification settings (see `UserSettings`).
export async function loadSettings( ){
    const response = await apiFetch("api/auth/settings", { method: "GET", credentials: "include"} )

    return response;
}

// Body for PATCH /api/auth/settings: send only the flags that changed.
export type UpdateSettingsData = Partial<Omit<UserSettings, "user_id">>;

// PATCH /api/auth/settings: returns 204 (no body) on success.
export async function modifySettings ( data: UpdateSettingsData ) {
    const response = await apiFetch("api/auth/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( data ),
    });

    return response;
}

export async function modifyProfile ( data: UpdateProfileData ) {
    const response = await fetch (`${API_URL}/api/auth/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( data ) 
    });


    return response;
}
// First letter of the first name + first letter of the last name, e.g. "Yasmine Alaoui" -> "YA".
// Returns "?" while the user isn't loaded yet.
export function getInitials ( user: Pick<User, "first_name" | "last_name"> | null ): string {
    const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase();
    return initials || "?";
}
