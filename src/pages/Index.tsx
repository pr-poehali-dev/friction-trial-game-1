import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type GameStage = 'intro' | 'character-select' | 'character-intro' | 'prosecution' | 'defense' | 'witnesses' | 'quiz' | 'verdict';

interface Character {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  arguments: string[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const characters: Character[] = [
  {
    id: 'judge',
    name: 'Судья',
    role: 'Ведущий суда',
    icon: 'Scale',
    color: 'text-secondary',
    arguments: []
  },
  {
    id: 'prosecution',
    name: 'Обвинение',
    role: 'Вредное трение',
    icon: 'Flame',
    color: 'text-destructive',
    arguments: [
      'Трение изнашивает детали машин и механизмов',
      'При трении выделяется тепло, что приводит к потере энергии',
      'Трение снижает КПД двигателей и механизмов',
      'Из-за трения требуется постоянная смазка и обслуживание'
    ]
  },
  {
    id: 'defense',
    name: 'Защита',
    role: 'Полезное трение',
    icon: 'ShieldCheck',
    color: 'text-success',
    arguments: [
      'Трение позволяет нам ходить, не скользя',
      'Благодаря трению работают тормоза автомобилей',
      'Трение удерживает гвозди и болты в конструкциях',
      'Без трения невозможно было бы писать карандашом или ручкой'
    ]
  }
];

const witnesses = [
  {
    id: 'spikes',
    name: 'Шипы',
    icon: 'Mountain',
    testimony: 'Я увеличиваю трение! Благодаря мне автомобили не скользят на льду. Я создаю дополнительное сцепление с поверхностью.',
    side: 'defense'
  },
  {
    id: 'lubricant',
    name: 'Смазка',
    icon: 'Droplet',
    testimony: 'Я уменьшаю трение между деталями механизмов. Без меня двигатели быстро изнашиваются и перегреваются.',
    side: 'prosecution'
  },
  {
    id: 'bearing',
    name: 'Подшипники',
    icon: 'CircleDot',
    testimony: 'Я заменяю трение скольжения на трение качения. Это снижает потери энергии в механизмах в десятки раз!',
    side: 'prosecution'
  }
];

const questions: Question[] = [
  {
    id: 1,
    question: 'Что происходит при трении скольжения?',
    options: [
      'Энергия сохраняется полностью',
      'Механическая энергия превращается в тепловую',
      'Тепловая энергия превращается в механическую',
      'Энергия исчезает'
    ],
    correct: 1,
    explanation: 'При трении механическая энергия движения преобразуется в тепловую энергию, что приводит к нагреву поверхностей.'
  },
  {
    id: 2,
    question: 'Какой вид трения самый маленький?',
    options: [
      'Трение покоя',
      'Трение скольжения',
      'Трение качения',
      'Все виды трения одинаковы'
    ],
    correct: 2,
    explanation: 'Трение качения значительно меньше трения скольжения. Поэтому колесо катится легче, чем скользит.'
  },
  {
    id: 3,
    question: 'Для чего используют смазку в механизмах?',
    options: [
      'Для увеличения трения',
      'Для уменьшения трения',
      'Для защиты от коррозии',
      'Для уменьшения трения и защиты от коррозии'
    ],
    correct: 3,
    explanation: 'Смазка создает тонкую пленку между деталями, уменьшая их непосредственный контакт и защищая металл от окисления.'
  },
  {
    id: 4,
    question: 'Почему зимой автомобили ставят шипованные шины?',
    options: [
      'Для уменьшения трения',
      'Для красоты',
      'Для увеличения сцепления со льдом',
      'Для защиты шин'
    ],
    correct: 2,
    explanation: 'Шипы увеличивают коэффициент трения между шиной и скользкой поверхностью, обеспечивая лучшее управление автомобилем.'
  }
];

const Index = () => {
  const [stage, setStage] = useState<GameStage>('intro');
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const prosecutionChar = characters.find(c => c.id === 'prosecution')!;
  const defenseChar = characters.find(c => c.id === 'defense')!;

  const CharacterBadge = () => {
    const charMap: Record<string, { name: string; icon: string; colorClass: string }> = {
      prosecution: { name: 'Обвинение', icon: 'Flame', colorClass: 'bg-destructive' },
      defense: { name: 'Защита', icon: 'ShieldCheck', colorClass: 'bg-success' },
      judge: { name: 'Судья', icon: 'Scale', colorClass: 'bg-primary' }
    };
    const char = charMap[selectedCharacter || 'judge'];
    return (
      <div className={`inline-flex items-center gap-2 ${char.colorClass} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}>
        <Icon name={char.icon as any} size={16} />
        Вы: {char.name}
      </div>
    );
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setShowExplanation(false);
      setSelectedAnswer(answers[nextIndex]);
    } else {
      setStage('verdict');
    }
  };

  const calculateScore = () => {
    return answers.filter((answer, index) => answer === questions[index].correct).length;
  };

  const renderIntro = () => (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="max-w-4xl w-full shadow-2xl animate-scale-up">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-6 rounded-full">
              <Icon name="Scale" size={64} className="text-primary" />
            </div>
          </div>
          <CardTitle className="text-5xl font-heading font-bold mb-4">
            Суд над Силой трения
          </CardTitle>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Интерактивная ролевая игра для изучения физики трения
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="font-heading font-semibold text-xl mb-3">О суде</h3>
            <p className="text-muted-foreground leading-relaxed">
              Сегодня в зале суда рассматривается дело о силе трения. Обвинение утверждает, что трение — 
              вредное явление, которое изнашивает механизмы и приводит к потерям энергии. Защита настаивает, 
              что без трения невозможна нормальная жизнь. Вам предстоит выслушать аргументы обеих сторон, 
              показания свидетелей и вынести справедливый вердикт.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {characters.map((char) => (
              <div key={char.id} className="bg-card border rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                <Icon name={char.icon as any} size={40} className={`mx-auto mb-2 ${char.color}`} />
                <h4 className="font-heading font-semibold">{char.name}</h4>
                <p className="text-sm text-muted-foreground">{char.role}</p>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => setStage('character-select')} 
            size="lg" 
            className="w-full text-lg font-semibold"
          >
            Выбрать персонажа
            <Icon name="ChevronRight" className="ml-2" size={20} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderCharacterSelect = () => {
    const selectableCharacters = [
      {
        id: 'prosecution',
        name: 'Обвинение',
        role: 'Вредное трение',
        icon: 'Flame',
        color: 'destructive',
        bgColor: 'from-red-50 to-orange-50',
        description: 'Докажите, что трение наносит вред технике и приводит к потерям энергии',
        mission: 'Представить доказательства вреда трения для механизмов'
      },
      {
        id: 'defense',
        name: 'Защита',
        role: 'Полезное трение',
        icon: 'ShieldCheck',
        color: 'success',
        bgColor: 'from-green-50 to-emerald-50',
        description: 'Докажите, что трение необходимо для нормальной жизни',
        mission: 'Защитить трение, показав его важность в повседневной жизни'
      },
      {
        id: 'judge',
        name: 'Судья',
        role: 'Ведущий суда',
        icon: 'Scale',
        color: 'primary',
        bgColor: 'from-blue-50 to-cyan-50',
        description: 'Беспристрастно выслушайте обе стороны и вынесите справедливый вердикт',
        mission: 'Объективно оценить аргументы и принять взвешенное решение'
      }
    ];

    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-2xl mb-8 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl font-heading font-bold mb-2">
                Выберите свою роль
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Каждый персонаж имеет уникальную перспективу на силу трения
              </p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {selectableCharacters.map((char, index) => (
              <Card 
                key={char.id}
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-scale-up group"
                style={{ animationDelay: `${index * 0.15}s` }}
                onClick={() => {
                  setSelectedCharacter(char.id);
                  setStage('character-intro');
                }}
              >
                <CardHeader className={`bg-gradient-to-br ${char.bgColor} rounded-t-lg`}>
                  <div className="flex justify-center mb-4">
                    <div className={`bg-${char.color}/20 p-6 rounded-full group-hover:scale-110 transition-transform`}>
                      <Icon name={char.icon as any} size={64} className={`text-${char.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-heading text-center">{char.name}</CardTitle>
                  <p className="text-center text-muted-foreground font-semibold">{char.role}</p>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {char.description}
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Target" size={16} />
                      Ваша миссия:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {char.mission}
                    </p>
                  </div>
                  <Button className="w-full" variant={char.id === 'judge' ? 'outline' : 'default'}>
                    Играть за {char.name}
                    <Icon name="ArrowRight" className="ml-2" size={18} />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            onClick={() => setStage('intro')} 
            variant="ghost" 
            className="mt-8 mx-auto flex items-center"
          >
            <Icon name="ArrowLeft" className="mr-2" size={18} />
            Назад
          </Button>
        </div>
      </div>
    );
  };

  const renderCharacterIntro = () => {
    const charData: Record<string, any> = {
      prosecution: {
        name: 'Обвинение',
        icon: 'Flame',
        color: 'text-destructive',
        bgColor: 'from-red-50 to-orange-50',
        quote: 'Трение — главный враг эффективности!',
        facts: [
          'Трение вызывает износ деталей на миллиарды рублей ежегодно',
          'До 20% энергии двигателя теряется из-за трения',
          'Космические аппараты требуют специальной смазки для работы в условиях трения'
        ],
        animation: {
          icon: 'Zap',
          text: 'Энергия теряется при каждом движении!'
        }
      },
      defense: {
        name: 'Защита',
        icon: 'ShieldCheck',
        color: 'text-success',
        bgColor: 'from-green-50 to-emerald-50',
        quote: 'Без трения жизнь невозможна!',
        facts: [
          'Трение позволяет нам ходить и бегать',
          'Тормозная система автомобилей спасает миллионы жизней благодаря трению',
          'Даже письмо ручкой возможно только благодаря силе трения'
        ],
        animation: {
          icon: 'Heart',
          text: 'Трение защищает нас каждый день!'
        }
      },
      judge: {
        name: 'Судья',
        icon: 'Scale',
        color: 'text-primary',
        bgColor: 'from-blue-50 to-cyan-50',
        quote: 'Справедливость требует взвешенного подхода',
        facts: [
          'Физика трения изучается более 300 лет',
          'Коэффициент трения зависит от материала и условий',
          'Современные технологии позволяют управлять трением'
        ],
        animation: {
          icon: 'Brain',
          text: 'Истина требует научного анализа!'
        }
      }
    };

    const char = charData[selectedCharacter || 'judge'];

    return (
      <div className={`min-h-screen p-6 bg-gradient-to-br ${char.bgColor}`}>
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl animate-scale-up">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className={`bg-white p-8 rounded-full shadow-xl animate-pulse`}>
                    <Icon name={char.icon as any} size={80} className={char.color} />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl animate-bounce">
                    !
                  </div>
                </div>
              </div>
              <CardTitle className="text-4xl font-heading font-bold mb-4">
                Вы играете за: {char.name}
              </CardTitle>
              <p className={`text-2xl font-semibold italic ${char.color}`}>
                "{char.quote}"
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
                  <Icon name={char.animation.icon as any} size={24} className={char.color} />
                  Важные факты
                </h3>
                <div className="space-y-3">
                  {char.facts.map((fact: string, index: number) => (
                    <div 
                      key={index}
                      className="flex gap-3 items-start animate-slide-right"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${char.bgColor} flex items-center justify-center`}>
                          <Icon name="Check" size={14} className={char.color} />
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-40 bg-slate-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 animate-bounce">
                    <Icon name={char.animation.icon as any} size={64} className={char.color} />
                    <p className="font-semibold text-lg">{char.animation.text}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStage('prosecution')} 
                size="lg" 
                className="w-full text-lg font-semibold"
              >
                Начать судебное заседание
                <Icon name="ChevronRight" className="ml-2" size={20} />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderProsecution = () => {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">Этап 1 из 5</Badge>
              <Progress value={20} className="h-2 w-64" />
            </div>
            <CharacterBadge />
          </div>

        <Card className="shadow-2xl animate-fade-in">
          <CardHeader className="bg-destructive/5">
            <div className="flex items-center gap-4">
              <div className="bg-destructive/10 p-4 rounded-full">
                <Icon name={prosecutionChar.icon as any} size={48} className="text-destructive" />
              </div>
              <div>
                <CardTitle className="text-3xl font-heading">{prosecutionChar.name}</CardTitle>
                <p className="text-muted-foreground">{prosecutionChar.role}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-card border-l-4 border-destructive p-4 rounded">
              <p className="font-semibold mb-4">Речь обвинения:</p>
              <p className="text-muted-foreground italic">
                "Ваша честь! Я представляю доказательства того, что сила трения наносит огромный вред технике и приводит к неоправданным потерям энергии."
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-xl">Аргументы обвинения:</h3>
              {prosecutionChar.arguments.map((arg, index) => (
                <div 
                  key={index} 
                  className="flex gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20 animate-slide-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center font-bold text-destructive">
                    {index + 1}
                  </div>
                  <p className="flex-1 pt-1">{arg}</p>
                </div>
              ))}
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Flame" size={20} className="text-destructive" />
                Демонстрация: Потеря энергии при трении
              </h4>
              <div className="relative h-32 bg-slate-200 rounded overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-between px-8">
                  <div className="w-16 h-16 bg-destructive rounded-lg animate-pulse" />
                  <Icon name="ArrowRight" size={32} className="text-muted-foreground animate-pulse" />
                  <Icon name="Flame" size={48} className="text-orange-500 animate-pulse" />
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-muted-foreground">
                  Движущийся объект → Трение → Выделение тепла
                </div>
              </div>
            </div>

            <Button onClick={() => setStage('defense')} size="lg" className="w-full">
              Слово защите
              <Icon name="ChevronRight" className="ml-2" size={20} />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    );
  };

  const renderDefense = () => {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">Этап 2 из 5</Badge>
              <Progress value={40} className="h-2 w-64" />
            </div>
            <CharacterBadge />
          </div>

        <Card className="shadow-2xl animate-fade-in">
          <CardHeader className="bg-success/5">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-4 rounded-full">
                <Icon name={defenseChar.icon as any} size={48} className="text-success" />
              </div>
              <div>
                <CardTitle className="text-3xl font-heading">{defenseChar.name}</CardTitle>
                <p className="text-muted-foreground">{defenseChar.role}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-card border-l-4 border-success p-4 rounded">
              <p className="font-semibold mb-4">Речь защиты:</p>
              <p className="text-muted-foreground italic">
                "Ваша честь! Без силы трения жизнь на Земле была бы невозможна. Позвольте представить доказательства полезности трения."
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-xl">Аргументы защиты:</h3>
              {defenseChar.arguments.map((arg, index) => (
                <div 
                  key={index} 
                  className="flex gap-3 p-4 bg-success/5 rounded-lg border border-success/20 animate-slide-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center font-bold text-success">
                    {index + 1}
                  </div>
                  <p className="flex-1 pt-1">{arg}</p>
                </div>
              ))}
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Footprints" size={20} className="text-success" />
                Демонстрация: Ходьба благодаря трению
              </h4>
              <div className="relative h-32 bg-slate-200 rounded overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <Icon name="User" size={40} className="text-success animate-bounce" />
                  <div className="flex flex-col gap-1">
                    <Icon name="ArrowDown" size={20} className="text-muted-foreground" />
                    <div className="h-1 w-20 bg-success rounded" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-muted-foreground">
                  Сила трения между обувью и землей позволяет отталкиваться
                </div>
              </div>
            </div>

            <Button onClick={() => setStage('witnesses')} size="lg" className="w-full">
              Опросить свидетелей
              <Icon name="ChevronRight" className="ml-2" size={20} />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    );
  };

  const renderWitnesses = () => {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">Этап 3 из 5</Badge>
              <Progress value={60} className="h-2 w-64" />
            </div>
            <CharacterBadge />
          </div>

        <Card className="shadow-2xl animate-fade-in mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading">Показания свидетелей</CardTitle>
            <p className="text-muted-foreground">Эксперты дают показания о роли трения</p>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {witnesses.map((witness, index) => (
            <Card 
              key={witness.id} 
              className="shadow-lg animate-slide-right"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 p-4 rounded-full ${
                    witness.side === 'defense' ? 'bg-success/10' : 'bg-primary/10'
                  }`}>
                    <Icon 
                      name={witness.icon as any} 
                      size={40} 
                      className={witness.side === 'defense' ? 'text-success' : 'text-primary'} 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-heading font-semibold text-xl">{witness.name}</h3>
                      <Badge variant={witness.side === 'defense' ? 'default' : 'secondary'}>
                        {witness.side === 'defense' ? 'Защита' : 'Обвинение'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg italic">
                      "{witness.testimony}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          onClick={() => {
            setStage('quiz');
            setCurrentQuestion(0);
            setShowExplanation(false);
            setSelectedAnswer(answers[0]);
          }} 
          size="lg" 
          className="w-full mt-6"
        >
          Перейти к проверке знаний
          <Icon name="ChevronRight" className="ml-2" size={20} />
        </Button>
      </div>
    </div>
    );
  };

  const renderQuiz = () => {
    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                Этап 4 из 5 • Вопрос {currentQuestion + 1} из {questions.length}
              </Badge>
              <Progress value={60 + (currentQuestion / questions.length) * 20} className="h-2 w-64" />
            </div>
            <CharacterBadge />
          </div>

          <Card className="shadow-2xl animate-scale-up">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup 
                value={selectedAnswer !== null ? selectedAnswer.toString() : undefined} 
                onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
                disabled={showExplanation}
              >
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                        showExplanation
                          ? index === question.correct
                            ? 'border-success bg-success/5'
                            : index === selectedAnswer
                            ? 'border-destructive bg-destructive/5'
                            : 'border-border bg-muted/30'
                          : 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer'
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                      {showExplanation && index === question.correct && (
                        <Icon name="CheckCircle" className="text-success" size={24} />
                      )}
                      {showExplanation && index === selectedAnswer && index !== question.correct && (
                        <Icon name="XCircle" className="text-destructive" size={24} />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {showExplanation && (
                <div className={`p-4 rounded-lg border-l-4 animate-fade-in ${
                  isCorrect 
                    ? 'bg-success/5 border-success' 
                    : 'bg-destructive/5 border-destructive'
                }`}>
                  <div className="flex items-start gap-3">
                    <Icon 
                      name={isCorrect ? 'Lightbulb' : 'Info'} 
                      className={isCorrect ? 'text-success' : 'text-destructive'} 
                      size={24} 
                    />
                    <div>
                      <p className="font-semibold mb-2">
                        {isCorrect ? 'Правильно!' : 'Неправильно'}
                      </p>
                      <p className="text-muted-foreground">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {showExplanation && (
                <Button onClick={nextQuestion} size="lg" className="w-full">
                  {currentQuestion < questions.length - 1 ? 'Следующий вопрос' : 'Вынести вердикт'}
                  <Icon name="ChevronRight" className="ml-2" size={20} />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderVerdict = () => {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge variant="outline" className="mb-2">Этап 5 из 5</Badge>
            <Progress value={100} className="h-2" />
          </div>

          <Card className="shadow-2xl animate-scale-up">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-6 rounded-full">
                  <Icon name="Scale" size={64} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-4xl font-heading font-bold mb-2">
                Вердикт суда
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Ваш результат: {score} из {questions.length} ({percentage.toFixed(0)}%)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary/20">
                <h3 className="font-heading font-bold text-2xl mb-4 text-center">
                  Постановление суда
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                  Рассмотрев все представленные доказательства, выслушав аргументы обвинения и защиты, 
                  а также показания свидетелей, суд выносит следующее решение:
                </p>
                <div className="bg-card p-5 rounded-lg space-y-3 border-l-4 border-primary">
                  <p className="font-semibold text-lg">
                    Сила трения признается АМБИВАЛЕНТНЫМ явлением природы
                  </p>
                  <p className="text-muted-foreground">
                    Трение действительно вызывает износ деталей и потери энергии, что подтверждает 
                    обвинение. Однако защита убедительно доказала, что без трения невозможна нормальная 
                    жизнь и работа большинства механизмов.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-destructive/5 p-5 rounded-lg border border-destructive/20">
                  <h4 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
                    <Icon name="Flame" className="text-destructive" size={24} />
                    Вредные проявления
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Minus" size={16} className="mt-1 flex-shrink-0" />
                      <span>Износ механизмов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Minus" size={16} className="mt-1 flex-shrink-0" />
                      <span>Потеря энергии</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Minus" size={16} className="mt-1 flex-shrink-0" />
                      <span>Требуется смазка</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-success/5 p-5 rounded-lg border border-success/20">
                  <h4 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
                    <Icon name="ShieldCheck" className="text-success" size={24} />
                    Полезные проявления
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Plus" size={16} className="mt-1 flex-shrink-0" />
                      <span>Обеспечивает ходьбу</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Plus" size={16} className="mt-1 flex-shrink-0" />
                      <span>Работа тормозов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Plus" size={16} className="mt-1 flex-shrink-0" />
                      <span>Удерживает крепёж</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h4 className="font-heading font-semibold text-xl mb-3">Научный вывод</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Задача инженеров и учёных — не устранить трение полностью, а научиться управлять им: 
                  увеличивать там, где это необходимо (тормоза, обувь, дороги), и уменьшать там, 
                  где оно вредно (подшипники, двигатели). Современные технологии позволяют эффективно 
                  контролировать силу трения с помощью смазочных материалов, специальных покрытий и 
                  оптимальной конструкции механизмов.
                </p>
              </div>

              <Button 
                onClick={() => {
                  setStage('intro');
                  setSelectedCharacter(null);
                  setCurrentQuestion(0);
                  setAnswers(Array(questions.length).fill(null));
                  setShowExplanation(false);
                  setSelectedAnswer(null);
                }} 
                size="lg" 
                className="w-full"
                variant="outline"
              >
                <Icon name="RotateCcw" className="mr-2" size={20} />
                Начать заново
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderStage = () => {
    switch (stage) {
      case 'intro':
        return renderIntro();
      case 'character-select':
        return renderCharacterSelect();
      case 'character-intro':
        return renderCharacterIntro();
      case 'prosecution':
        return renderProsecution();
      case 'defense':
        return renderDefense();
      case 'witnesses':
        return renderWitnesses();
      case 'quiz':
        return renderQuiz();
      case 'verdict':
        return renderVerdict();
      default:
        return renderIntro();
    }
  };

  return renderStage();
};

export default Index;