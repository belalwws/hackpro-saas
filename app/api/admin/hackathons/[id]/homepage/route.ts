import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get homepage data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    
    // Get homepage data from HackathonLandingPage
    let homepageData = null
    
    try {
      const landingPage = await prisma.hackathonLandingPage.findUnique({
        where: { hackathonId: resolvedParams.id }
      })

      if (landingPage && landingPage.htmlContent) {
        try {
          // Try to parse JSON from htmlContent (stored as JSON string)
          const parsed = JSON.parse(landingPage.htmlContent)
          if (parsed.blocks) {
            homepageData = parsed
          }
        } catch {
          // If not JSON, it's HTML - return empty blocks
          homepageData = null
        }
      }
    } catch (error) {
      console.log('No homepage data found, returning empty')
    }

    return NextResponse.json({
      blocks: homepageData?.blocks || [],
      colors: homepageData?.colors || {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        background: '#ffffff',
        text: '#1f2937'
      },
      isEnabled: homepageData?.isEnabled || false
    })

  } catch (error) {
    console.error('Error fetching homepage:', error)
    return NextResponse.json({ error: 'Failed to fetch homepage' }, { status: 500 })
  }
}

// POST - Save homepage data
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const data = await request.json()

    // Verify hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!hackathon) {
      return NextResponse.json({ error: 'الهاكاثون غير موجود' }, { status: 404 })
    }

    // Store raw data as JSON in a separate field (we'll use htmlContent temporarily)
    const rawData = JSON.stringify({
      blocks: data.blocks || [],
      colors: data.colors || {},
      isEnabled: data.isEnabled || false
    })

    // Generate the actual HTML for the landing page
    const generatedHtml = generateHomepageHtml(data, hackathon, resolvedParams.id)
    const generatedCss = generateHomepageCss(data)

    // Get or create landing page
    const landingPage = await prisma.hackathonLandingPage.upsert({
      where: { hackathonId: resolvedParams.id },
      update: {
        htmlContent: generatedHtml,
        cssContent: generatedCss,
        isEnabled: data.isEnabled || false,
        updatedAt: new Date()
      },
      create: {
        hackathonId: resolvedParams.id,
        isEnabled: data.isEnabled || false,
        htmlContent: generatedHtml,
        cssContent: generatedCss,
        jsContent: ''
      }
    })

    // Store raw data in jsContent field (as JSON string) for easy retrieval
    await prisma.hackathonLandingPage.update({
      where: { id: landingPage.id },
      data: {
        jsContent: rawData
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حفظ الصفحة الرئيسية بنجاح'
    })

  } catch (error) {
    console.error('Error saving homepage:', error)
    return NextResponse.json({ error: 'Failed to save homepage' }, { status: 500 })
  }
}

function generateHomepageHtml(data: any, hackathon: any, hackathonId: string): string {
  const blocks = (data.blocks || []).filter((b: any) => b.enabled).sort((a: any, b: any) => a.order - b.order)
  
  let html = `
    <div class="homepage-container" style="background-color: ${data.colors?.background || '#ffffff'}; color: ${data.colors?.text || '#1f2937'};">
  `

  blocks.forEach((block: any) => {
    switch (block.type) {
      case 'hero':
        html += `
          <section class="hero-section" style="
            background: ${block.data.backgroundImage ? `url(${block.data.backgroundImage})` : `linear-gradient(135deg, ${data.colors?.primary || '#6366f1'} 0%, ${data.colors?.secondary || '#8b5cf6'} 100%)`};
            background-size: cover;
            background-position: center;
            min-height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            ${block.data.overlay ? '<div style="position: absolute; inset: 0; background: rgba(0,0,0,0.4);"></div>' : ''}
            <div style="position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 2rem; text-align: center; color: white;">
              <h1 style="font-size: 3.5rem; font-weight: bold; margin-bottom: 1.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                ${block.data.title || hackathon.title}
              </h1>
              <p style="font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.9;">
                ${block.data.subtitle || hackathon.description}
              </p>
              <a href="${block.data.ctaLink || `/hackathons/${hackathonId}/register-form`}" 
                 style="
                   display: inline-block;
                   padding: 1rem 2rem;
                   background-color: ${data.colors?.accent || '#ec4899'};
                   color: white;
                   text-decoration: none;
                   border-radius: 8px;
                   font-size: 1.2rem;
                   font-weight: bold;
                   transition: transform 0.2s;
                 "
                 onmouseover="this.style.transform='scale(1.05)'"
                 onmouseout="this.style.transform='scale(1)'">
                ${block.data.ctaText || 'سجل الآن'}
              </a>
            </div>
          </section>
        `
        break
      case 'about':
        html += `
          <section class="about-section" style="padding: 5rem 2rem; background-color: ${data.colors.background};">
            <div style="max-width: 1200px; margin: 0 auto;">
              <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 3rem; color: ${data.colors.text};">
                ${section.data.title || 'عن الهاكاثون'}
              </h2>
              <div style="display: grid; grid-template-columns: ${section.data.image ? '1fr 1fr' : '1fr'}; gap: 3rem; align-items: center;">
                ${section.data.image ? `
                  <div>
                    <img src="${section.data.image}" alt="${section.data.title}" style="width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
                  </div>
                ` : ''}
                <div>
                  <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: 2rem; color: ${data.colors.text};">
                    ${section.data.description || hackathon.description}
                  </p>
                  ${section.data.features && section.data.features.length > 0 ? `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                      ${section.data.features.map((feature: any) => `
                        <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${feature.icon || '✨'}</div>
                          <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: ${data.colors.text};">${feature.title || ''}</h3>
                          <p style="font-size: 0.9rem; color: #666;">${feature.description || ''}</p>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </section>
        `
        break
      case 'schedule':
        html += `
          <section class="schedule-section" style="padding: 5rem 2rem; background-color: #f9fafb;">
            <div style="max-width: 800px; margin: 0 auto;">
              <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 3rem;">
                ${block.data.title || 'الجدول الزمني'}
              </h2>
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${(block.data.events || []).map((event: any) => `
                  <div style="
                    display: flex;
                    gap: 2rem;
                    padding: 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    align-items: start;
                  ">
                    <div style="text-align: center; min-width: 100px;">
                      <div style="font-size: 1.5rem; font-weight: bold; color: ${data.colors?.primary || '#6366f1'};">
                        ${new Date(event.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                      </div>
                      <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                        ${event.time || ''}
                      </div>
                    </div>
                    <div style="flex: 1;">
                      <h3 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.5rem;">
                        ${event.title || ''}
                      </h3>
                      <p style="color: #666; line-height: 1.6;">
                        ${event.description || ''}
                      </p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        `
        break
      case 'prizes':
        html += `
          <section class="prizes-section" style="padding: 5rem 2rem; background-color: ${data.colors?.background || '#ffffff'};">
            <div style="max-width: 1200px; margin: 0 auto;">
              <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 3rem; color: ${data.colors?.text || '#1f2937'};">
                ${block.data.title || 'الجوائز'}
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                ${(block.data.prizes || []).map((prize: any) => `
                  <div style="
                    padding: 2.5rem;
                    text-align: center;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 2px solid transparent;
                    transition: all 0.3s;
                  " onmouseover="this.style.borderColor='${data.colors?.primary || '#6366f1'}'; this.style.transform='translateY(-5px)'"
                     onmouseout="this.style.borderColor='transparent'; this.style.transform='translateY(0)'">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                    <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: ${data.colors?.text || '#1f2937'};">
                      ${prize.position || ''}
                    </h3>
                    <div style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: ${data.colors?.primary || '#6366f1'};">
                      ${prize.amount || ''} ${prize.currency || ''}
                    </div>
                    <p style="color: #666; line-height: 1.6;">
                      ${prize.description || ''}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        `
        break
      case 'faq':
        html += `
          <section class="faq-section" style="padding: 5rem 2rem; background-color: #f9fafb;">
            <div style="max-width: 800px; margin: 0 auto;">
              <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 3rem;">
                ${block.data.title || 'الأسئلة الشائعة'}
              </h2>
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${(block.data.questions || []).map((faq: any) => `
                  <div style="
                    padding: 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  ">
                    <h3 style="font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; color: ${data.colors?.text || '#1f2937'};">
                      ${faq.question || ''}
                    </h3>
                    <p style="color: #666; line-height: 1.8;">
                      ${faq.answer || ''}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        `
        break
      case 'stats':
        html += `
          <section class="stats-section" style="
            padding: 5rem 2rem;
            background: linear-gradient(135deg, ${data.colors?.primary || '#6366f1'} 0%, ${data.colors?.secondary || '#8b5cf6'} 100%);
            color: white;
          ">
            <div style="max-width: 1200px; margin: 0 auto;">
              <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 3rem;">
                ${block.data.title || 'إحصائيات الهاكاثون'}
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
                ${(block.data.stats || []).map((stat: any) => `
                  <div style="text-align: center;">
                    <div style="font-size: 3.5rem; font-weight: bold; margin-bottom: 0.5rem;">
                      ${stat.number || ''}
                    </div>
                    <div style="font-size: 1.2rem; opacity: 0.9;">
                      ${stat.label || ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        `
        break
      case 'contact':
        html += `
          <section class="contact-section" style="padding: 5rem 2rem; background-color: ${data.colors?.background || '#ffffff'};">
            <div style="max-width: 1000px; margin: 0 auto;">
              <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 3rem; color: ${data.colors?.text || '#1f2937'};">
                ${block.data.title || 'تواصل معنا'}
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                ${block.data.email ? `
                  <div style="padding: 2rem; text-align: center; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📧</div>
                    <p style="font-weight: bold; color: ${data.colors?.text || '#1f2937'};">
                      ${block.data.email}
                    </p>
                  </div>
                ` : ''}
                ${block.data.phone ? `
                  <div style="padding: 2rem; text-align: center; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📱</div>
                    <p style="font-weight: bold; color: ${data.colors?.text || '#1f2937'};">
                      ${block.data.phone}
                    </p>
                  </div>
                ` : ''}
                ${block.data.address ? `
                  <div style="padding: 2rem; text-align: center; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📍</div>
                    <p style="font-weight: bold; color: ${data.colors?.text || '#1f2937'};">
                      ${block.data.address}
                    </p>
                  </div>
                ` : ''}
              </div>
            </div>
          </section>
        `
        break
    }
  })

  html += `</div>`
  return html
}

function generateHomepageCss(data: any): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Cairo', 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      direction: rtl;
      line-height: 1.6;
    }

    .homepage-container {
      width: 100%;
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2rem !important;
      }
      
      .hero-section p {
        font-size: 1rem !important;
      }
    }
  `
}

export const dynamic = 'force-dynamic'

