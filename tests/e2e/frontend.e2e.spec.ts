import { expect, test } from '@playwright/test'

test.describe('Sitio público', () => {
  // El idioma se detecta por Accept-Language; fijamos español para que sea determinista.
  test.use({ locale: 'es-MX' })

  test('la raíz redirige a /es y muestra el Hero', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveURL(/\/es$/)
    await expect(page).toHaveTitle(/ÆVΛ/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('el sitio está disponible en inglés', async ({ page }) => {
    await page.goto('http://localhost:3000/en')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { name: 'Why ÆVΛ' })).toBeAttached()
  })

  test('el formulario de contacto valida los campos', async ({ page }) => {
    await page.goto('http://localhost:3000/es#contact', { waitUntil: 'networkidle' })

    await page.getByRole('button', { name: 'Enviar' }).click()

    await expect(page.getByText('Revisa los campos marcados.')).toBeVisible()
  })
})
