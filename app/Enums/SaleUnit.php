<?php

namespace App\Enums;

enum SaleUnit: string
{
    case Pagne = 'pagne';
    case Lot = 'lot';
    case Metre = 'metre';
    case Piece = 'piece';

    public function label(): string
    {
        return match ($this) {
            self::Pagne => 'Le pagne',
            self::Lot => 'Le lot',
            self::Metre => 'Le mètre',
            self::Piece => 'La pièce',
        };
    }
}
