import { Module, User } from './types';

// ==========================================
// CONFIGURAÇÃO DE USUÁRIOS
// ==========================================
export const ALLOWED_USERS: User[] = [
  { 
    cpf: '12345678900', 
    name: 'Ana Costureira', 
    active: true, 
    plan: 'basic',
    stats: {
      completedLessons: ['aula-01-01', 'aula-01-02'],
      totalSales: 1250.00,
      monthlySales: [
        { month: 'Jan', amount: 800 },
        { month: 'Fev', amount: 950 },
        { month: 'Mar', amount: 1250 },
      ],
      financialRecords: [],
      clients: [
        {
          id: 'c1',
          name: 'Maria Silva',
          whatsapp: '11999999999',
          measurements: { bust: 90, waist: 70, hip: 95 },
          photos: [],
          createdAt: new Date().toISOString()
        }
      ],
      orders: [
        {
          id: 'o1',
          orderNumber: 'PED-0001',
          clientId: 'c1',
          patternId: 'p1',
          deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          value: 180,
          status: 'costura',
          history: [
            { status: 'corte', date: new Date(Date.now() - 86400000).toISOString() },
            { status: 'costura', date: new Date().toISOString() }
          ],
          createdAt: new Date().toISOString()
        }
      ],
      portfolio: [],
      goals: { monthly: 3000, current: 1250 }
    }
  },
  { 
    cpf: '11122233344', 
    name: 'Atelier da Maria', 
    active: true, 
    plan: 'diamond',
    stats: {
      completedLessons: ['aula-01-01', 'aula-01-02', 'aula-01-03', 'aula-01-04'],
      totalSales: 3450.00,
      monthlySales: [
        { month: 'Jan', amount: 2100 },
        { month: 'Fev', amount: 2800 },
        { month: 'Mar', amount: 3450 },
      ],
      financialRecords: [],
      clients: [],
      orders: [],
      portfolio: [],
      goals: { monthly: 5000, current: 3450 }
    }
  },
  { 
    cpf: '99988877766', 
    name: 'Carla Modas Kids', 
    active: true, 
    plan: 'basic',
    stats: {
      completedLessons: [],
      totalSales: 0,
      monthlySales: [
        { month: 'Jan', amount: 0 },
        { month: 'Fev', amount: 0 },
        { month: 'Mar', amount: 0 },
      ],
      financialRecords: [],
      clients: [],
      orders: [],
      portfolio: [],
      goals: { monthly: 2000, current: 0 }
    }
  },
];

// ==========================================
// CONTEÚDO DO CURSO
// ==========================================
// OPÇÕES DE VÍDEO:
// 1. YouTube (Recomendado): Use 'youtubeId: "ID_DO_VIDEO"'
// 2. Drive: Use 'videoEmbedId: "ID_DO_ARQUIVO"'
// 3. MP4 Direto: Use 'videoUrl: "https://.../video.mp4"'

export const COURSE_CONTENT: Module[] = [
  {
    id: 'mod-01',
    title: 'Módulo 1: Video Aulas',
    description: 'Passo a passo obrigatório para garantir que o molde saia no tamanho correto.',
    lessons: [
      {
        id: 'aula-01-01',
        title: 'Transferência dos Moldes para o Tecido (Passo a Passo)',
        description: 'Para imprimir corretamente, você precisa deste programa gratuito. Veja como instalar.',
        duration: '05:00',
        videoUrl: 'https://dl.dropboxusercontent.com/scl/fi/i5r6ta2k1qvlgq2zcg81e/Moldes-Dona-Concei-o-_-Moldes-de-Costura-de-Qualidade-2.mp4?rlkey=odus2ar5p9qlswemvp22nycdt&st=z9tma0l0',
      },
      {
        id: 'aula-01-02',
        title: 'Configurando a Impressora e Montagem',
        description: 'Aprenda a configurar a impressão em 100% e como montar as folhas corretamente.',
        duration: '08:20',
        // Link do Dropbox configurado para streaming direto (dl.dropboxusercontent.com)
        videoUrl: 'https://dl.dropboxusercontent.com/scl/fi/ygdfxckomgp7bokmil8pe/impress-o-e-montagem.mp4?rlkey=dtphb5j47bj7p3r2qqeaj8kc3&st=cd4rz2zb',
      },
      {
        id: 'aula-01-03',
        title: 'Ajustes Básicos no Molde (Grade, Alargamento e Redução)',
        description: 'Antes de imprimir tudo, imprima apenas a primeira folha e meça o quadrado de teste.',
        duration: '04:15',
        videoUrl: 'https://dl.dropboxusercontent.com/scl/fi/yk8uj44ykfuc7lcv82di8/Moldes-Dona-Concei-o-_-Moldes-de-Costura-de-Qualidade-3.mp4?rlkey=gijnxxj3ytuijox17wwvrn4rm&st=h2j2qpzw',
      },
      {
        id: 'aula-01-04',
        title: 'Preparação do Molde e Organização',
        description: 'Como refilar as margens e unir as folhas com fita adesiva para formar o molde completo.',
        duration: '12:30',
        videoUrl: 'https://dl.dropboxusercontent.com/scl/fi/dsmye7kdwqbrznun28l2m/Moldes-Dona-Concei-o-_-Moldes-de-Costura-de-Qualidade.mp4?rlkey=r9ep1znksd8hrka787ob8uv9j&st=e7k239gi',
      },
      {
        id: 'aula-01-05',
        title: '5 Dicas de Acabamentos',
        description: 'Guia Completo: 5 Dicas de Acabamentos Profissionais para Transformar suas Roupas!',
        duration: '10:00',
        videoUrl: 'https://dl.dropboxusercontent.com/scl/fi/0ube1kzlci8fc2tf4ne5u/0221.mp4?rlkey=h8kvxft1kkk300useqw729o21&st=8sdg7cjb'
      }
    ]
  },
  {
    id: 'mod-03',
    label: 'Área de Download',
    title: 'Sua Coleção de Moldes',
    description: 'Sua coleção completa de moldes premium prontos para download.',
    lessons: [
      {
        id: 'aula-03-01',
        title: '📦 Acessar Pacote Básico',
        description: 'Clique no botão abaixo para acessar a pasta com todos os moldes do pacote básico.',
        duration: '00:00',
        materialLink: 'https://drive.google.com/drive/folders/15BZnU8TM47hP-5eAITVYCnJ-lCdfcRKk'
      },
      {
        id: 'aula-03-02',
        title: '🎁 Bônus Exclusivo',
        description: 'Aproveite este conteúdo extra preparado especialmente para você.',
        duration: '00:00',
        materialLink: 'https://drive.google.com/drive/folders/1QkO86LydfiLay6-2Zbl3Cql4Cm6nra3F'
      },
      {
        id: 'aula-03-diamond',
        title: '💎 Pacote Diamante',
        description: 'Desbloqueie o acesso completo a todos os moldes exclusivos.',
        duration: '00:00',
        locked: true
      }
    ]
  }
];

export const APP_METADATA = {
  name: 'Atelier Kids',
  supportEmail: 'kitofertaprospera@gmail.com'
};

import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Molde Vestido Princesa',
    description: 'Molde completo com grade de tamanhos do 1 ao 10 anos. Inclui vídeo aula de montagem.',
    price: 49.90,
    suggestedPrice: 180.00,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800',
    category: 'Vestidos',
    features: ['Grade 1 a 10 anos', 'PDF em A4 e Plotter', 'Vídeo Aula Inclusa']
  },
  {
    id: 'p2',
    title: 'Conjunto Jardineira Unissex',
    description: 'Jardineira clássica e confortável. Perfeita para brincar. Grade RN a 4 anos.',
    price: 39.90,
    suggestedPrice: 149.90,
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=800',
    category: 'Conjuntos',
    features: ['Grade RN a 4 anos', 'PDF em camadas', 'Fácil de costurar']
  },
  {
    id: 'p3',
    title: 'Kit Enxoval Bebê',
    description: 'Kit com 5 moldes essenciais: Body, Mijão, Touca, Luva e Babador.',
    price: 69.90,
    suggestedPrice: 249.90,
    unit: '/Kit',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800',
    category: 'Bebê',
    features: ['5 Moldes', 'Grade RN a G', 'Guia de tecidos']
  },
  {
    id: 'p4',
    title: 'Casaco Teddy Bear',
    description: 'Molde de casaco com capuz de orelhinhas. Super quentinho e estiloso.',
    price: 45.00,
    suggestedPrice: 129.00,
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=800',
    category: 'Inverno',
    features: ['Grade 1 a 8 anos', 'Forrado', 'Acabamento premium']
  }
];

export const BASIC_PACKAGE_CATEGORIES = [
  { 
    id: '01', 
    title: '01 - Baby Look', 
    count: 6, 
    image: 'https://i.postimg.cc/L8kGkqNT/D_NQ_NP_2X_795938_MLB95629772420_102025_F_kit_4_babylook_camiseta_manga_curta_cotton_infantil_menina.png', 
    link: 'https://drive.google.com/open?id=1FReNGljK3BK1p3CqMF9hUeysXViqvzeq&usp=drive_copy',
    images: [
      'https://i.postimg.cc/L8kGkqNT/D_NQ_NP_2X_795938_MLB95629772420_102025_F_kit_4_babylook_camiseta_manga_curta_cotton_infantil_menina.png',
      'https://i.postimg.cc/3xQPDjCg/D_NQ_NP_2X_868158_MLB95630031180_102025_F_kit_4_babylook_camiseta_manga_curta_cotton_infantil_menina.png',
      'https://i.postimg.cc/WbkB3YZX/D_NQ_NP_2X_619957_MLB95629772418_102025_F_kit_4_babylook_camiseta_manga_curta_cotton_infantil_menina.png',
      'https://i.postimg.cc/vZ7C713t/D_NQ_NP_2X_947332_MLB96071291237_102025_F_kit_4_babylook_camiseta_manga_curta_cotton_infantil_menina.png'
    ]
  },
  { 
    id: '02', 
    title: '02 - Camisetas-Blusas', 
    count: 11, 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400',
    link: 'https://drive.google.com/open?id=1PjPN1oJOCT8AryuVgdQEI6duaT_R0PbE&usp=drive_copy',
    images: [
      'https://i.postimg.cc/4y9PNtjD/00415371001B04_1.png',
      'https://i.postimg.cc/VvCgLM2K/01_kit_camisa_basica_infantil_feminina.png',
      'https://i.postimg.cc/prFCX8gH/00415753000Q10_1.png',
      'https://i.postimg.cc/hvdsPxHc/br_11134207_7r98o_m6vwfnmbm88ge7.jpg',
      'https://i.postimg.cc/L51D6frM/Camiseta_Infantil_Estampa_Margarida_Disney_Tam_4_a_10_10057634906_C1_(1).png'
    ]
  },
  { 
    id: '03', 
    title: '03 - Polo', 
    count: 11, 
    image: 'https://i.postimg.cc/fbkDqTG3/camisa_polo_infantil_masculina_verde_737781_600_1.png', 
    link: 'https://drive.google.com/open?id=11hgaHr0j8WEkNk0mI8Pmrrbvp_JCYL4i&usp=drive_copy',
    images: [
      'https://i.postimg.cc/fbkDqTG3/camisa_polo_infantil_masculina_verde_737781_600_1.png',
      'https://i.postimg.cc/7LbwtYF0/conjunto_infantil_polo_azul_coloritta_30384_1_51da7f494a5dace80f6c1e9ce558b80b.png',
      'https://i.postimg.cc/rpzMZFB1/conjunto_menino_alakazoo_polo_algodao_e_bermuda_moletom_branco_azul_38035_1_d965d7d2c59f8a94286d310f.png',
      'https://i.postimg.cc/SKjk1NBr/conjunto_polo_infantil_vermelha_bsica_com_bermuda_1_20251105135115_5cde47e0d671.png'
    ]
  },
  { id: '04', title: '04 - Regatas', count: 3, image: 'https://i.postimg.cc/qqH01fHf/shopping.png', link: 'https://drive.google.com/open?id=1_yKO84YMuaXOZjgIbI_Lgan87n8hf2Uf&usp=drive_copy' },
  { id: '05', title: '05 - Calças', count: 6, image: 'https://i.postimg.cc/FKhLnqm1/D-NQ-NP-2X-626091-MLB106699274154-022026-F-kit-4-calcas-moletom-infantil-menina-menino-escola-creche.png', link: 'https://drive.google.com/open?id=1-EzY5cd7z1qlTWMCRsJMHimQuagd3g_x&usp=drive_copy' },
  { 
    id: '06', 
    title: '06 - Moletons', 
    count: 6, 
    image: 'https://i.postimg.cc/8P984QRb/01-conjunto-moletom-infantil-menino-future-is-now-preto-coloritta.png', 
    link: 'https://drive.google.com/open?id=1XJxbBol5GGvHoY-ZnWtT74qBYQdTBcFl&usp=drive_copy',
    images: [
      'https://i.postimg.cc/8P984QRb/01-conjunto-moletom-infantil-menino-future-is-now-preto-coloritta.png',
      'https://i.postimg.cc/2ygHQYsd/conjunto-infantil-menina-moletom-peluciado-com-capuz-raposa-8857-1500x2000-contain.png'
    ]
  },
  { 
    id: '07', 
    title: '07 - Shorts e Bermudas', 
    count: 13, 
    image: 'https://i.postimg.cc/6QftMWfc/16_1604_ai.png', 
    link: 'https://drive.google.com/open?id=1LSnbXjrW65zHGGAO4GAEtcqqfBQDh8Ho&usp=drive_copy',
    images: [
      'https://i.postimg.cc/6QftMWfc/16_1604_ai.png',
      'https://i.postimg.cc/s24sTj4L/26707_1623_0001.png',
      'https://i.postimg.cc/s24sTj4N/3000304_9010_1.png',
      'https://i.postimg.cc/4d4ZMDW1/kit_5_bermuda_short_infantil_mnabana_praia_agua_tactel_4_ao_10_estampadas_black_friday_457_1_2020101.png',
      'https://i.postimg.cc/zBD5Msxp/modamix_lote1_8_agosto_117.png'
    ]
  },
  { 
    id: '08', 
    title: '08 - Roupas Intimas', 
    count: 5, 
    image: 'https://i.postimg.cc/QCkz3CVK/101421770.png', 
    link: 'https://drive.google.com/open?id=16VsZQQJcW2dAe7Qmh74d3LbYk6Sf1FCW&usp=drive_copy',
    images: [
      'https://i.postimg.cc/QCkz3CVK/101421770.png',
      'https://i.postimg.cc/4yT0qV4v/16_40_02_546_conjunto_infantil_lavanda_61_f9c8522d152b95885516866671016157_1024_1024.png',
      'https://i.postimg.cc/QCkz3CVp/113.png',
      'https://i.postimg.cc/8cBYScsM/conjunto_calcinha_e_sutia_ponto_certo_3.jpg',
      'https://i.postimg.cc/kGFHmGDF/img_9632_51369393087_o_628d08a35d96e.png'
    ]
  },
  { 
    id: '09', 
    title: '09 - Pijamas', 
    count: 13, 
    image: 'https://i.postimg.cc/C5L2wY8v/0067_conjunto_pijama_infantil_meinina_menta_lhama_miss_pijama_algodao_3.png', 
    link: 'https://drive.google.com/open?id=1Z3tUVEQ0-vNBrhxxTgDKtY3RZudvBroJ&usp=drive_copy',
    images: [
      'https://i.postimg.cc/C5L2wY8v/0067_conjunto_pijama_infantil_meinina_menta_lhama_miss_pijama_algodao_3.png',
      'https://i.postimg.cc/vBvjRD4K/029a7284_666762816eae2.png',
      'https://i.postimg.cc/pTB7Ny9b/pijama_infantil_americano_longo_algodao_lua_azul_755637_600_1.png',
      'https://i.postimg.cc/tTzf0710/tpd_5071.png',
      'https://i.postimg.cc/qqMFp0KF/whatsapp_image_2024_08_30_at_12_48_18_66d1e9edd0c04.png'
    ]
  },
  { 
    id: '10', 
    title: '10 - Escolar', 
    count: 7, 
    image: 'https://i.postimg.cc/0jwtCCTS/br_11134207_7r98o_lobyg0h93hd51f.jpg', 
    link: 'https://drive.google.com/open?id=13HOXRRlKw2e2Q23hP44FXdnzUrHOB3ns&usp=drive_copy',
    images: [
      'https://i.postimg.cc/0jwtCCTS/br_11134207_7r98o_lobyg0h93hd51f.jpg',
      'https://i.postimg.cc/zDbP5JVQ/D_NQ_NP_625627_MLB82083682576_022025_O_kit_uniforme_escolar_infantil_vero_camiseta_e_bermuda.png',
      'https://i.postimg.cc/CMB6YFzW/d348cd4377.png'
    ]
  },
  { 
    id: '11', 
    title: '11 - Recém Nascido (Bebê)', 
    count: 17, 
    image: 'https://i.postimg.cc/0NC1Y9Y1/1_lqsmoib9v1.png', 
    link: 'https://drive.google.com/open?id=1SsprJUf2Oehht9Bc-5YfjBiFJuwIG-3e&usp=drive_copy',
    images: [
      'https://i.postimg.cc/0NC1Y9Y1/1_lqsmoib9v1.png',
      'https://i.postimg.cc/CK4pGwGw/br_11134207_7r98o_loa2m1v7mrevf9.jpg',
      'https://i.postimg.cc/mrSWYTY4/D_771938_MLB106701976174_022026_O.jpg',
      'https://i.postimg.cc/5tmWBfBb/D_890858_MLB98466694545_112025_O.jpg'
    ]
  },
  { 
    id: '12', 
    title: '12 - Variados 1', 
    count: 26, 
    image: 'https://i.postimg.cc/MpT9PqJ8/16_2376_ai.png', 
    link: 'https://drive.google.com/open?id=1IXYM60fj6McGOXrjoQUcsWuG7f7P2qv6&usp=drive_copy',
    images: [
      'https://i.postimg.cc/MpT9PqJ8/16_2376_ai.png',
      'https://i.postimg.cc/Jznp6MCr/br_11134207_7qukw_ljx1qdzwphk68e.jpg',
      'https://i.postimg.cc/RZFgs4xB/conjunto_de_menino_camisa_social_g7zbhbc1uk.png',
      'https://i.postimg.cc/y8dLQsCK/conjunto_menino_alakazoo_camiseta_em_meia_malha_penteada_listrada_bege_e_bermuda_com_bolso_em_moleto.png',
      'https://i.postimg.cc/7Z6Kswrw/kit_sortido_12_pecas_de_roupas_infantis_feminino_verao_6_camisetas_6_bermudas_29570_large.png',
      'https://i.postimg.cc/kg4T1qPM/roupas_de_verao.jpg'
    ]
  },
  { 
    id: '13', 
    title: '13 - Variados 2', 
    count: 15, 
    image: 'https://i.postimg.cc/mDRXSMb8/03_kit_sortido_10_pecas_de_roupa_infantil_menina_5_camisetas_5_bermudas_kit_5_conjuntos_menina.png', 
    link: 'https://drive.google.com/open?id=1_UBmvsqIHfK9XhTkU6q6eYYxFhf1Fjlm&usp=drive_copy',
    images: [
      'https://i.postimg.cc/mDRXSMb8/03_kit_sortido_10_pecas_de_roupa_infantil_menina_5_camisetas_5_bermudas_kit_5_conjuntos_menina.png',
      'https://i.postimg.cc/Jnm6QJ1F/16_2311_ai.png',
      'https://i.postimg.cc/XJ3HgFVz/conjunto_blusa_e_shorts_com_elastano_bege_818992_301_1.png',
      'https://i.postimg.cc/26mcxvzJ/design_sem_nome_2023_11_30t103334_941.png',
      'https://i.postimg.cc/Jnm6QJ1f/KVTC_10ASI_C1.png'
    ]
  },
  { 
    id: '14', 
    title: '14 - Conjuntos', 
    count: 14, 
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=400', 
    link: 'https://drive.google.com/open?id=1YLdAqxqdD3-0ozCOGh9Im1W2Xw4-mXkB&usp=drive_copy',
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=400',
      'https://i.postimg.cc/m2bcGrr0/687280_805_1010.png',
      'https://i.postimg.cc/QxXBrMt8/conjunto_infantil_blusa_calca_wide_leg_251_1_683b1c903d1852dac6b61621f588e40e.png',
      'https://i.postimg.cc/xT0kSdC9/conjunto_infantil_masculino_leo_100_algodo_1_20250911214057_ceef817a2752.png',
      'https://i.postimg.cc/KvZKyYzb/conjunto_menina_com_blusa_e_shorts_branco_745378_600_1.png',
      'https://i.postimg.cc/BQq8Gv60/kit_5_conjuntos_roupa_infantil_menino_universo_encantado.jpg'
    ]
  },
  { 
    id: '15', 
    title: 'BÔNUS - MOLDES BEBÊS', 
    count: 49, 
    image: 'https://i.postimg.cc/BQq8Gv60/kit_5_conjuntos_roupa_infantil_menino_universo_encantado.jpg', 
    link: 'https://drive.google.com/drive/folders/18tq1DpXklbjzyIkV_qAFFEtu6WhRztkH',
    images: [
      'https://i.postimg.cc/BQq8Gv60/kit_5_conjuntos_roupa_infantil_menino_universo_encantado.jpg',
      'https://i.postimg.cc/JzNdHP8D/conjunto_conjunto_bebe_moletom_peluciado_comfy_capuz_caramelo_p_1684466347391.jpg',
      'https://i.postimg.cc/QdQnK0Dg/design_sem_nome_f639d2a5246497352417610544501941_1024_1024.png',
      'https://i.postimg.cc/DwrY4Bhr/kids_conjunto_kids_moletom_peluciado_comfy_capuz_mescla_claro_p_1685305080270.jpg',
      'https://i.postimg.cc/CxG6nm0H/macacao_bebe_ursinha_vermelho_224309621_1_692b11d3341e838a5f6da59175aac5e4.png',
      'https://i.postimg.cc/wB94XLx1/roupas_bebe_conjunto_macacao_pagao_canelado_suedine_100_algodao_confortavel_enxoval_rn_gg_ate_18_mes.jpg'
    ]
  },
];
