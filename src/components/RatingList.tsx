import type { Rating } from '../types/rating';

interface Props {
  ratings: Rating[];
  onEdit: (rating: Rating) => void;
  onDelete: (id: number) => void;
}

export default function RatingList({ ratings, onEdit, onDelete }: Props) {
  if (ratings.length === 0) {
    return <p className="text-gray-500">No hay calificaciones todavia.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ratings.map((rating) => (
        <div
          key={rating.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <p className="text-sm text-gray-600">
            Partido: {rating.match?.name ?? `#${rating.matchId}`}
          </p>
          <p className="text-sm text-gray-600">
            {rating.rater
              ? `${rating.rater.name} ${rating.rater.lastName}`
              : `#${rating.raterId}`}
            {' → '}
            {rating.rated
              ? `${rating.rated.name} ${rating.rated.lastName}`
              : `#${rating.ratedId}`}
          </p>
          <p className="text-lg font-semibold">{'⭐'.repeat(rating.stars)}</p>
          <p className="text-sm">{rating.comment}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit(rating)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(rating.id)}
              className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
