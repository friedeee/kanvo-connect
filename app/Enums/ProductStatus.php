<?php

namespace App\Enums;

enum ProductStatus: string
{
    case Draft = 'draft';
    case PendingReview = 'pending_review';
    case Published = 'published';
    case Rejected = 'rejected';
    // Désactivé par le vendeur lui-même.
    case Disabled = 'disabled';
    // Retiré du catalogue par l'administration.
    case Withdrawn = 'withdrawn';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Brouillon',
            self::PendingReview => 'En attente de validation',
            self::Published => 'Publié',
            self::Rejected => 'Refusé',
            self::Disabled => 'Désactivé',
            self::Withdrawn => 'Retiré par l’administration',
        };
    }

    /**
     * Statuts à partir desquels le vendeur peut soumettre son produit à validation.
     */
    public function canBeSubmitted(): bool
    {
        return in_array($this, [self::Draft, self::Rejected, self::Disabled], true);
    }
}
