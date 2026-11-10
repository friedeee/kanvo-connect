<?php

namespace Tests\Feature\Console;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_an_admin_and_prints_an_invitation_link(): void
    {
        $this->artisan('kanvo:create-admin', ['email' => 'chef@kanvo.bj', 'name' => 'Chef Kanvô'])
            ->expectsOutputToContain('/invitation/')
            ->assertSuccessful();

        $admin = User::where('email', 'chef@kanvo.bj')->firstOrFail();
        $this->assertTrue($admin->isAdmin());
        $this->assertNull($admin->seller);
    }

    public function test_it_refuses_an_email_already_in_use(): void
    {
        User::factory()->create(['email' => 'chef@kanvo.bj']);

        $this->artisan('kanvo:create-admin', ['email' => 'chef@kanvo.bj', 'name' => 'Chef'])
            ->assertFailed();

        $this->assertSame(0, User::where('is_admin', true)->count());
    }
}
