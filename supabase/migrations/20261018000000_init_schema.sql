-- ============================================================================
-- AI Email Writer SaaS Schema & Row Level Security
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text,
    avatar_url text,
    tier text not null default 'free' check (tier in ('free', 'pro', 'enterprise')),
    monthly_generation_limit integer not null default 30,
    generations_used_this_month integer not null default 0,
    last_reset_date timestamptz not null default now(),
    preferred_tone text default 'professional',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. EMAILS TABLE (Stores drafts and generated email history)
create table if not exists public.emails (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    subject text not null default 'Untitled Email',
    body text not null,
    recipient text default '',
    purpose text default '',
    context text default '',
    key_points jsonb default '[]'::jsonb,
    tone text not null default 'professional',
    email_type text not null default 'general',
    length text not null default 'medium',
    is_draft boolean not null default false,
    version integer not null default 1,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. USAGE LOGS TABLE (Audit log for generation actions & token metrics)
create table if not exists public.usage_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    action text not null,
    prompt_tokens integer default 0,
    completion_tokens integer default 0,
    model_used text not null default 'default',
    created_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_emails_user_id on public.emails(user_id);
create index if not exists idx_emails_created_at on public.emails(created_at desc);
create index if not exists idx_emails_is_draft on public.emails(is_draft);
create index if not exists idx_usage_logs_user_id on public.usage_logs(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.emails enable row level security;
alter table public.usage_logs enable row level security;

-- PROFILES Policies
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

-- EMAILS Policies
create policy "Users can view their own emails"
    on public.emails for select
    using (auth.uid() = user_id);

create policy "Users can create their own emails"
    on public.emails for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own emails"
    on public.emails for update
    using (auth.uid() = user_id);

create policy "Users can delete their own emails"
    on public.emails for delete
    using (auth.uid() = user_id);

-- USAGE LOGS Policies
create policy "Users can view their own usage logs"
    on public.usage_logs for select
    using (auth.uid() = user_id);

create policy "Users can insert their own usage logs"
    on public.usage_logs for insert
    with check (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS & AUTOMATION
-- ============================================================================

-- Function to handle new user registration from Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, full_name, avatar_url, tier, monthly_generation_limit, generations_used_this_month)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        'free',
        30,
        0
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile when auth.users row is inserted
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Updated at triggers
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
    before update on public.profiles
    for each row execute function public.handle_updated_at();

drop trigger if exists set_emails_updated_at on public.emails;
create trigger set_emails_updated_at
    before update on public.emails
    for each row execute function public.handle_updated_at();
