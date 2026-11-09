<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/categories', [
            'categories' => Category::withCount('products')->orderBy('position')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $category = Category::create($this->validated($request));

        AuditLog::record('category.created', $category, ['name' => $category->name]);

        return $this->done('Catégorie créée.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $category->update($this->validated($request, $category));

        AuditLog::record('category.updated', $category, ['name' => $category->name]);

        return $this->done('Catégorie mise à jour.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Cette catégorie contient des produits : déplacez-les avant de la supprimer.']);

            return back();
        }

        AuditLog::record('category.deleted', $category, ['name' => $category->name]);
        $category->delete();

        return $this->done('Catégorie supprimée.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Category $category = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'position' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ]);

        $slug = Str::slug($data['name']);
        validator(['name' => $slug], [
            'name' => [Rule::unique('categories', 'slug')->ignore($category)],
        ])->validate();

        return [...$data, 'slug' => $slug, 'position' => $data['position'] ?? 0];
    }

    private function done(string $message): RedirectResponse
    {
        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return back();
    }
}
