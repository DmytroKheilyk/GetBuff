-- GetBuff.store — схема базы данных
-- Выполните этот скрипт в SQL Editor на https://supabase.com/dashboard

-- ---------------------------------------------------------------------------
-- Таблицы
-- ---------------------------------------------------------------------------

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  image_url text,
  platform text,
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  seller_name text not null,
  seller_avatar text,
  seller_rating numeric(2, 1) not null default 5.0
    check (seller_rating >= 0 and seller_rating <= 5),
  is_online boolean not null default false,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  category text not null
    check (category in ('currency', 'accounts', 'items', 'boost')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers (id) on delete cascade,
  buyer_name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Индексы
-- ---------------------------------------------------------------------------

create index if not exists idx_games_slug on public.games (slug);
create index if not exists idx_offers_game_id on public.offers (game_id);
create index if not exists idx_offers_category on public.offers (category);
create index if not exists idx_offers_created_at on public.offers (created_at desc);
create index if not exists idx_orders_offer_id on public.orders (offer_id);
create index if not exists idx_orders_buyer_name on public.orders (buyer_name);
create index if not exists idx_orders_status on public.orders (status);

-- ---------------------------------------------------------------------------
-- Row Level Security (публичное чтение для маркетплейса)
-- ---------------------------------------------------------------------------

alter table public.games enable row level security;
alter table public.offers enable row level security;
alter table public.orders enable row level security;

create policy "games_select_public"
  on public.games
  for select
  to anon, authenticated
  using (true);

create policy "offers_select_public"
  on public.offers
  for select
  to anon, authenticated
  using (true);

create policy "offers_insert_authenticated"
  on public.offers
  for insert
  to authenticated
  with check (true);

create policy "offers_update_own"
  on public.offers
  for update
  to authenticated
  using (
    seller_name = (auth.jwt() ->> 'email')
    or seller_name = (auth.uid()::text)
  )
  with check (
    seller_name = (auth.jwt() ->> 'email')
    or seller_name = (auth.uid()::text)
  );

create policy "offers_delete_own"
  on public.offers
  for delete
  to authenticated
  using (
    seller_name = (auth.jwt() ->> 'email')
    or seller_name = (auth.uid()::text)
  );

create index if not exists idx_offers_seller_name on public.offers (seller_name);

create policy "orders_select_buyer"
  on public.orders
  for select
  to authenticated
  using (
    buyer_name = (auth.jwt() ->> 'email')
    or buyer_name = (auth.uid()::text)
  );

create policy "orders_select_seller"
  on public.orders
  for select
  to authenticated
  using (
    exists (
      select 1 from public.offers o
      where o.id = orders.offer_id
        and (
          o.seller_name = (auth.jwt() ->> 'email')
          or o.seller_name = (auth.uid()::text)
        )
    )
  );

create policy "orders_insert_buyer"
  on public.orders
  for insert
  to authenticated
  with check (
    buyer_name = (auth.jwt() ->> 'email')
    or buyer_name = (auth.uid()::text)
  );

create policy "orders_update_seller"
  on public.orders
  for update
  to authenticated
  using (
    exists (
      select 1 from public.offers o
      where o.id = orders.offer_id
        and (
          o.seller_name = (auth.jwt() ->> 'email')
          or o.seller_name = (auth.uid()::text)
        )
    )
  )
  with check (
    exists (
      select 1 from public.offers o
      where o.id = orders.offer_id
        and (
          o.seller_name = (auth.jwt() ->> 'email')
          or o.seller_name = (auth.uid()::text)
        )
    )
  );

-- ---------------------------------------------------------------------------
-- Сообщения чата заказов
-- ---------------------------------------------------------------------------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  sender_name text not null,
  content text not null check (char_length(trim(content)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_order_id on public.messages (order_id);
create index if not exists idx_messages_created_at on public.messages (created_at);

alter table public.messages enable row level security;

-- Участник заказа: покупатель или продавец лота
create policy "messages_select_participant"
  on public.messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders ord
      join public.offers o on o.id = ord.offer_id
      where ord.id = messages.order_id
        and (
          ord.buyer_name = (auth.jwt() ->> 'email')
          or ord.buyer_name = (auth.uid()::text)
          or o.seller_name = (auth.jwt() ->> 'email')
          or o.seller_name = (auth.uid()::text)
        )
    )
  );

create policy "messages_insert_participant"
  on public.messages
  for insert
  to authenticated
  with check (
    (
      sender_name = (auth.jwt() ->> 'email')
      or sender_name = (auth.uid()::text)
    )
    and exists (
      select 1
      from public.orders ord
      join public.offers o on o.id = ord.offer_id
      where ord.id = messages.order_id
        and (
          ord.buyer_name = (auth.jwt() ->> 'email')
          or ord.buyer_name = (auth.uid()::text)
          or o.seller_name = (auth.jwt() ->> 'email')
          or o.seller_name = (auth.uid()::text)
        )
    )
  );

-- Realtime: включите репликацию для public.messages в Supabase Dashboard
-- Database → Replication → supabase_realtime → messages

-- ---------------------------------------------------------------------------
-- Отзывы о продавцах
-- ---------------------------------------------------------------------------

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  buyer_name text not null,
  seller_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null check (char_length(trim(comment)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_order_id on public.reviews (order_id);
create index if not exists idx_reviews_seller_name on public.reviews (seller_name);
create index if not exists idx_reviews_created_at on public.reviews (created_at desc);

alter table public.reviews enable row level security;

create policy "reviews_select_public"
  on public.reviews
  for select
  to anon, authenticated
  using (true);

create policy "reviews_insert_buyer_completed"
  on public.reviews
  for insert
  to authenticated
  with check (
    (
      buyer_name = (auth.jwt() ->> 'email')
      or buyer_name = (auth.uid()::text)
    )
    and exists (
      select 1
      from public.orders ord
      where ord.id = reviews.order_id
        and ord.status = 'completed'
        and (
          ord.buyer_name = (auth.jwt() ->> 'email')
          or ord.buyer_name = (auth.uid()::text)
        )
    )
  );

-- ---------------------------------------------------------------------------
-- Начальные данные (опционально — можно удалить, если заполняете вручную)
-- ---------------------------------------------------------------------------

insert into public.games (title, slug, image_url, platform) values
  ('Counter-Strike 2', 'cs2', null, 'PC'),
  ('Dota 2', 'dota-2', null, 'PC'),
  ('Roblox', 'roblox', null, 'PC / Mobile'),
  ('GTA V', 'gta-v', null, 'PC / Console')
on conflict (slug) do nothing;

-- Примеры лотов для Roblox (раскомментируйте после создания таблиц)
/*
insert into public.offers (game_id, seller_name, seller_avatar, seller_rating, is_online, description, price, category)
select
  g.id,
  'RobuxFast',
  'bg-sky-500/20 text-sky-400',
  4.9,
  true,
  '1000 робуксов чистыми, моментальная доставка через gift',
  890,
  'currency'
from public.games g where g.slug = 'roblox';
*/
