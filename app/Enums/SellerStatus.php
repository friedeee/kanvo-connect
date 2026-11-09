<?php

namespace App\Enums;

enum SellerStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Suspended = 'suspended';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'En attente',
            self::Approved => 'Validé',
            self::Suspended => 'Suspendu',
            self::Rejected => 'Refusé',
        };
    }
}
