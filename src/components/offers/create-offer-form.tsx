"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createOffer,
  type CreateOfferState,
} from "@/lib/actions/create-offer";
import type { Game } from "@/lib/games";
import { OFFER_CATEGORIES, type OfferCategory } from "@/lib/offers";

type CreateOfferFormProps = {
  games: Game[];
};

const initialState: CreateOfferState = {};

const fieldClassName =
  "border-zinc-800/80 bg-black/40 focus-visible:border-green-500/40 focus-visible:ring-green-500/20";

export function CreateOfferForm({ games }: CreateOfferFormProps) {
  const [state, formAction, pending] = useActionState(
    createOffer,
    initialState
  );
  const [gameId, setGameId] = useState("");
  const [category, setCategory] = useState<OfferCategory | "">("");

  const canSubmit =
    games.length > 0 && gameId.length > 0 && category.length > 0;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-green-400">
          ◆ Панель продавца
        </p>
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          Создать{" "}
          <span className="text-neon-gradient">новый лот</span>
        </h1>
        <p className="mt-2 text-zinc-500">
          Заполните форму — лот сразу появится в каталоге выбранной игры
        </p>
      </div>

      <form
        action={formAction}
        className="glass-panel space-y-6 rounded-2xl p-6 sm:p-8"
      >
        {state.error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {state.error}
          </p>
        )}

        <input type="hidden" name="game_id" value={gameId} />
        <input type="hidden" name="category" value={category} />

        <div className="space-y-2">
          <Label htmlFor="game_id" className="text-xs font-semibold uppercase tracking-wider text-green-500/70">
            Игра
          </Label>
          {games.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Список игр пуст. Добавьте игры в Supabase, чтобы создавать лоты.
            </p>
          ) : (
            <Select value={gameId} onValueChange={setGameId} required>
              <SelectTrigger className={`w-full ${fieldClassName}`}>
                <SelectValue placeholder="Выберите игру" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800/80 bg-zinc-900/95 backdrop-blur-md">
                {games.map((game) => (
                  <SelectItem key={game.id} value={game.id}>
                    {game.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-green-500/70">
            Категория
          </Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as OfferCategory)}
            required
          >
            <SelectTrigger className={`w-full ${fieldClassName}`}>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent className="border-zinc-800/80 bg-zinc-900/95 backdrop-blur-md">
              {OFFER_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-green-500/70">
            Описание лота
          </Label>
          <Textarea
            id="description"
            name="description"
            required
            minLength={10}
            rows={4}
            placeholder="Например: 1000 робуксов, моментальная доставка через gift..."
            className={`min-h-28 resize-y ${fieldClassName}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-xs font-semibold uppercase tracking-wider text-green-500/70">
            Цена, ₽
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            required
            min={1}
            step={1}
            placeholder="890"
            className={fieldClassName}
          />
        </div>

        <Button
          type="submit"
          disabled={pending || !canSubmit}
          className="neon-glow-hover w-full border border-green-500/30 bg-green-500 py-5 text-base font-bold text-black hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.45)] disabled:opacity-40"
        >
          {pending ? "Публикация..." : "Опубликовать лот"}
        </Button>
      </form>
    </div>
  );
}
