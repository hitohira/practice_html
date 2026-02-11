// 演習問題データ
const questions = [
    {
        id: 1,
        question: "太陽系の惑星の数は何個ですか？",
        type: "single",
        options: [
            "7個",
            "8個",
            "9個",
            "10個"
        ],
        correct: [1],
        explanation: "太陽系の惑星は8個です。水星、金星、地球、火星、木星、土星、天王星、海王星です。2006年に冥王星は準惑星に分類されました。"
    },
    {
        id: 2,
        question: "日本の四季はどれですか？（2つ選択）",
        type: "multiple",
        options: [
            "春",
            "梅雨",
            "夏",
            "台風"
        ],
        correct: [0, 2],
        explanation: "日本の四季は春、夏、秋、冬の4つです。梅雨や台風は季節的な現象ですが、四季には含まれません。"
    },
];
