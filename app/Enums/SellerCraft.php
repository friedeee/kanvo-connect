<?php

namespace App\Enums;

enum SellerCraft: string
{
    case Weaver = 'weaver';
    case Workshop = 'workshop';
    case Designer = 'designer';
    case Tailor = 'tailor';
    case Creator = 'creator';

    public function label(): string
    {
        return match ($this) {
            self::Weaver => 'Tisserand',
            self::Workshop => 'Atelier de tissage',
            self::Designer => 'Styliste',
            self::Tailor => 'Couturier',
            self::Creator => 'Créateur',
        };
    }
}
