@props(['url'])
{{-- En-tête des e-mails : le nom du site aux couleurs de Kanvô (indigo et or). --}}
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
<span class="brand-mark">K</span>{{ trim($slot) }}<span class="brand-accent">.</span>
</a>
</td>
</tr>
