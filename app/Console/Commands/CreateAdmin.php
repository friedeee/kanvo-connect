<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\SellerInvitation;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/**
 * Crée un compte admin (il n'y a pas d'inscription publique) et affiche un lien
 * pour choisir son mot de passe. Sert notamment à créer le premier admin en ligne.
 */
#[Signature('kanvo:create-admin {email : Adresse e-mail de l’admin} {name : Nom affiché}')]
#[Description('Crée un compte admin Kanvô et affiche le lien pour choisir son mot de passe')]
class CreateAdmin extends Command
{
    public function handle(): int
    {
        $validator = Validator::make($this->arguments(), [
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::create([
            'name' => $this->argument('name'),
            'email' => $this->argument('email'),
            'password' => Str::password(40),
        ]);
        $user->forceFill(['is_admin' => true])->save();

        $this->info("Compte admin créé pour {$user->email}.");
        $this->line('Ouvrez ce lien (valable '.SellerInvitation::VALID_DAYS.' jours) pour choisir le mot de passe :');
        $this->newLine();
        $this->line(SellerInvitation::url($user));

        return self::SUCCESS;
    }
}
