<?php

namespace Database\Factories;

use App\Models\CategoryService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'price' => $this->faker->numberBetween(100000, 10000000),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'image_poster' => 'images/posters/' . $this->faker->image('public/images/posters', 640, 480, null, false),
            'category_service_id' => CategoryService::all()->first()->id,
            'languages' => implode(',', $this->faker->randomElements(['PHP', 'JavaScript', 'Python', 'Go', 'Java'], 2)),
            'is_published' => $this->faker->boolean(70), // 70% chance published
        ];
    }
}
