import type { MenuItem } from '@/types/menu';

const NOW = '2026-09-14T09:00:00.000Z';

export function createSeed(): MenuItem[] {
  return [
    { id: 'k-1', title: 'Борщ с говядиной', shop: 'kitchen', stock: 24, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'k-2', title: 'Паста карбонара', shop: 'kitchen', stock: 0, status: { kind: 'stopped', reason: 'out_of_stock', until: null }, updatedAt: NOW },
    { id: 'k-3', title: 'Стейк рибай', shop: 'kitchen', stock: 6, status: { kind: 'stopped', reason: 'equipment', until: '2026-09-14T15:00:00.000Z' }, updatedAt: NOW },
    { id: 'k-4', title: 'Цезарь с курицей', shop: 'kitchen', stock: 18, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'k-5', title: 'Том ям с креветками', shop: 'kitchen', stock: 9, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'k-6', title: 'Пицца Маргарита', shop: 'kitchen', stock: 31, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'b-1', title: 'Апероль шприц', shop: 'bar', stock: 40, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'b-2', title: 'Негрони', shop: 'bar', stock: 12, status: { kind: 'stopped', reason: 'quality', until: null }, updatedAt: NOW },
    { id: 'b-3', title: 'Лимонад домашний', shop: 'bar', stock: 0, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'b-4', title: 'Эспрессо', shop: 'bar', stock: 99, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'b-5', title: 'Фильтр-кофе', shop: 'bar', stock: 3, status: { kind: 'stopped', reason: 'menu_change', until: null }, updatedAt: NOW },
    { id: 'p-1', title: 'Тирамису', shop: 'pastry', stock: 14, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'p-2', title: 'Чизкейк Нью-Йорк', shop: 'pastry', stock: 7, status: { kind: 'available' }, updatedAt: NOW },
    { id: 'p-3', title: 'Круассан миндальный', shop: 'pastry', stock: 22, status: { kind: 'available' }, updatedAt: NOW },
  ];
}