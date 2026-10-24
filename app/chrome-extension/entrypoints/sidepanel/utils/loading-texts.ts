/**
 * 随机 Loading 文案
 * 用于 TimelineStatusStep 组件展示趣味等待提示
 */

const loadingTexts = [
  // 必选神梗
  'Era para ser tudo calmo e tranquilo',
  'Agora é correria total',
  'Eu sei que você tem pressa, mas calma',
  'Nadando cachorrinho no mar do conhecimento',
  'Deixa a bala voar mais um pouco',
  'Fazendo sua resposta à mão',
  'Reunindo os duendes da montanha',
  'Não apressa, já estou escrevendo (Nova pasta)',
  'Pensando até suar',
  'A CPU já está fritando',
  // 生活气息
  'Café coado devagar: o bom leva tempo',
  'Virando a panqueca do conhecimento',
  'Um brinde a mim mesmo, já vai',
  'Colocando a inspiração no forno',
  'Deixando a resposta em infusão',
  'Caprichando no carinho',
  'Tricotando um suéter de palavras para você',
  // 脑洞大开
  'Neurônios na balada',
  'A coruja da madrugada está pensando',
  'Colorindo a resposta',
  'Folheando a base de conhecimento como louco',
  'O circo do cérebro vai começar',
  'Juntando os 0 e os 1',
  'Preparando o golpe final',
  'A lupa embaçou, limpando',
  'Tentando entender esse pedido maluco',
  // 玄幻
  'Lançando feitiço, não interrompa',
  'Acordando os amigos de silício',
  'Conectando à sabedoria do ciberespaço',
  'Espere aí, mestre, estou calculando',
  'Atravessando o buraco negro do conhecimento',
  'Fazendo engenharia reversa da intenção humana',
  'A bola de cristal está embaçada, dando dois tapinhas',
  // 职场
  'O código corre mais que repórter atrás de notícia',
  'O responsável chegou, um momento',
  'Chegando a galope',
  'Transportando conhecimento na velocidade da luz',
  'A última peça do quebra-cabeça',
  'A resposta está quase pronta',
  'Contagem regressiva para o lançamento',
  'Mirando no alvo',
];

/**
 * 获取随机 Loading 文案
 */
export function getRandomLoadingText(): string {
  return loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
}
