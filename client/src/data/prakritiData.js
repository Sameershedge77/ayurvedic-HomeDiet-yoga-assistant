export const prakritiQuestions = [
    {
        id: 1,
        question: {
            en: "Which best describes your natural body structure, especially around your shoulders, chest, and hips?",
            hi: "आपकी प्राकृतिक शारीरिक संरचना का सबसे अच्छा वर्णन कौन सा है, विशेष रूप से आपके कंधों, छाती और कूल्हों के आसपास?",
            mr: "तुमची नैसर्गिक शरीराची ठेवण कशी आहे, विशेषतः खांदे, छाती आणि कंबर?"
        },
        note: {
            en: "Note: Height, weight, and age will be used for BMI calculation.",
            hi: "नोट: ऊंचाई, वजन और आयु का उपयोग बीएमआई गणना के लिए किया जाएगा।",
            mr: "टीप: उंची, वजन आणि वयाचा वापर बीएमआय गणनेसाठी केला जाईल."
        },
        requiresBMI: true,
        image: "/images/Prakriti Assesment/Q2/Body structure.jpg",
        options: [
            {
                id: "A",
                text: {
                    en: "Narrow frame (Underweight BMI < 18.5)",
                    hi: "पतला ढांचा (अल्प वजन BMI < 18.5)",
                    mr: "अरुंद बांधा (कमी वजन BMI < 18.5)"
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Medium frame (BMI 18.5 - 24.99)",
                    hi: "मध्यम ढांचा (सामान्य वजन BMI 18.5 - 24.99)",
                    mr: "मध्यम बांधा (सामान्य वजन BMI 18.5 - 24.99)"
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Wide frame (Overweight BMI ≥ 25.0)",
                    hi: "चौड़ा ढांचा (अधिक वजन BMI ≥ 25.0)",
                    mr: "रुंद बांधा (जास्त वजन BMI ≥ 25.0)"
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 2,
        question: {
            en: "Which of these best describe your weight in general throughout your life?",
            hi: "जीवन भर सामान्यतः आपका वजन कैसा रहा है?",
            mr: "आयुष्यात तुमचे वजन साधारणपणे कसे राहिले आहे?"
        },
        image: null,
        options: [
            {
                id: "A",
                text: {
                    en: "Thin. It's difficult for me to gain weight.",
                    hi: "पतला। मेरे लिए वजन बढ़ाना मुश्किल है।",
                    mr: "बारीक. वजन वाढवणे माझ्यासाठी कठीण आहे."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Medium. I gain and lose weight easily depending on my food and lifestyle.",
                    hi: "मध्यम। मैं भोजन और जीवनशैली के आधार पर आसानी से वजन बढ़ाता और घटाता हूँ।",
                    mr: "मध्यम. आहार आणि जीवनशैलीनुसार माझे वजन सहज वाढते किंवा कमी होते."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Heavy. I tend to gain weight easily and struggle to lose it.",
                    hi: "भारी। मेरा वजन आसानी से बढ़ जाता है और इसे कम करने में कठिनाई होती है।",
                    mr: "जड. माझे वजन सहज वाढते आणि ते कमी करणे कठीण जाते."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 3,
        question: {
            en: "Which of these best describe your skin in general (without any external ointments)?",
            hi: "सामान्यतः आपकी त्वचा का सबसे अच्छा वर्णन कौन सा है?",
            mr: "तुमच्या त्वचेचे स्वरूप साधारणपणे कसे असते?"
        },
        image: "/images/Prakriti Assesment/Q3/Screenshot 2026-01-18 095936.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Always dry, feels roughness. My body just drinks moisturizer.",
                    hi: "हमेशा सूखी, खुरदरी महसूस होती है।",
                    mr: "नेहमी कोरडी, खरखरीत वाटते."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Oily. It's easy for me to get pimples especially after spicy food.",
                    hi: "तैलीय। मसालेदार भोजन के बाद आसानी से मुँहासे हो जाते हैं।",
                    mr: "तेलकट. तिखट पदार्थ खाल्यावर लगेच पुरळ येतात."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Thick and smooth and stable without much care needed.",
                    hi: "मोटी और चिकनी, बिना ज्यादा देखभाल के स्थिर रहती है।",
                    mr: "जाड आणि मऊ, जास्त काळजी घेतल्याशिवाय चांगली राहते."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 4,
        question: {
            en: "Sweat After 30-min of good Workout.",
            hi: "30 मिनट की अच्छी कसरत के बाद पसीना।",
            mr: "३० मिनिटे व्यायाम केल्यानंतर येणारा घाम."
        },
        image: "/images/Prakriti Assesment/Q4/Gemini_Generated_Image_4ih0r14ih0r14ih0.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Barely wet. I don't sweat too much or very little.",
                    hi: "मुश्किल से गीला। मुझे बहुत कम पसीना आता है।",
                    mr: "फारच कमी. मला खूपच कमी घाम येतो."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Drenched! I sweat a LOT and my sweat can have strong smell.",
                    hi: "पसीने से तर-बतर! मुझे बहुत पसीना आता है और गंध भी तेज हो सकती है।",
                    mr: "घामाने पूर्ण ओले! मला खूप जास्त घाम येतो आणि घामाला उग्र वास असू शकतो."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Moderately sweat, but in humid weather my clothes get fully wet.",
                    hi: "औसत पसीना, लेकिन आर्द्र मौसम में कपड़े पूरी तरह गीले हो जाते हैं।",
                    mr: "मध्यम घाम येतो, पण दमट हवामानात कपडे पूर्ण ओले होतात."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 5,
        question: {
            en: "Weather adaptability",
            hi: "मौसम अनुकूलता",
            mr: "हवामानाशी जुळवून घेण्याची क्षमता"
        },
        image: "/images/Prakriti Assesment/Q5/Gemini_Generated_Image_tg5rqftg5rqftg5r.png",
        options: [
            {
                id: "A",
                text: {
                    en: "I feel cold in winter and need extra layers, but comfortable in summer.",
                    hi: "मुझे सर्दियों में बहुत ठंड लगती है, लेकिन गर्मियों में आरामदायक महसूस होता है।",
                    mr: "मला हिवाळ्यात खूप थंडी वाजते, पण उन्हाळा सुसह्य वाटतो."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "My body feels hot easily. Peak Summer is toughest. I prefer winter.",
                    hi: "मेरा शरीर जल्दी गर्म हो जाता है। गर्मी बहुत मुश्किल होती है।",
                    mr: "मला खूप लवकर उष्णता जाणवते. उन्हाळा खूप कठीण जातो, हिवाळा आवडतो."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "I am generally comfortable in all Seasons but prefer spring more.",
                    hi: "मैं आमतौर पर सभी मौसमों में सहज हूँ लेकिन वसंत अधिक पसंद है।",
                    mr: "मी सर्व ऋतूंमध्ये सहज राहतो पण वसंत ऋतू जास्त आवडतो."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 6,
        question: {
            en: "What is your hair like?",
            hi: "आपके बाल कैसे हैं?",
            mr: "तुमचे केस कसे आहेत?"
        },
        note: {
            en: "Note: Judge based on your natural hair condition.",
            hi: "नोट: अपने बालों की प्राकृतिक स्थिति के आधार पर निर्णय लें।",
            mr: "टीप: केसांच्या नैसर्गिक स्थितीवरून निवडा."
        },
        image: "/images/Prakriti Assesment/Q6/Screenshot 2026-01-18 120156.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Dry, thin, rough or frizzy. Also slightly scanty.",
                    hi: "रूखे, पतले, खुरदरे या घुंघराले। थोड़े कम भी हैं।",
                    mr: "कोरडे, पातळ, खरखरीत किंवा कुरळे. थोडे विरळ आहेत."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Straight, thin hair or tendency to premature greying.",
                    hi: "सीधे, पतले बाल या समय से पहले सफेद होने की प्रवृत्ति।",
                    mr: "सरळ, पातळ केस किंवा अकाली पांढरे होण्याची प्रवृत्ती."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Thick, dense, abundant with naturally shiny texture.",
                    hi: "घने, मोटे और स्वाभाविक रूप से चमकदार बनावट वाले।",
                    mr: "दाट, जाड आणि नैसर्गिकरित्या चमकदार पोत असलेले."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 7,
        question: {
            en: "What best describes your eyes?",
            hi: "आपकी आँखों का सबसे अच्छा वर्णन क्या है?",
            mr: "तुमच्या डोळ्यांचे वर्णन कसे कराल?"
        },
        image: "/images/Prakriti Assesment/Q7/Gemini_Generated_Image_wb1nmcwb1nmcwb1n.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Small and they often get dry.",
                    hi: "छोटी और अक्सर सूख जाती हैं।",
                    mr: "लहान आणि डोळे अनेकदा कोरडे पडतात."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Medium size and they have a sharp, intense gaze.",
                    hi: "मध्यम आकार और उनकी दृष्टि तीव्र होती है।",
                    mr: "मध्यम आकाराचे आणि नजर तीक्ष्ण असते."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Large size with thick eyelashes.",
                    hi: "बड़े आकार की और पलकें घनी होती हैं।",
                    mr: "मोठ्या आकाराचे आणि पापण्या दाट असतात."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 8,
        question: {
            en: "What's your hunger appetite like?",
            hi: "आपकी भूख कैसी है?",
            mr: "तुमची भूक कशी आहे?"
        },
        image: "/images/Prakriti Assesment/Q8/Gemini_Generated_Image_2pe6k42pe6k42pe6.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Irregular, sometimes not hungry at all, sometimes super hungry.",
                    hi: "अनियमित, कभी भूख नहीं लगती तो कभी बहुत ज्यादा लगती है।",
                    mr: "अनियमित, कधी अजिबात भूक लागत नाही तर कधी खूप लागते."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Regular, strong hunger, frequently throughout the day.",
                    hi: "नियमित और तेज भूख, दिन भर बार-बार।",
                    mr: "नियमित आणि तीव्र भूक, दिवसातून वारंवार लागते."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Moderate, I feel hungry only at fixed timings.",
                    hi: "मध्यम, केवल निश्चित समय पर ही भूख महसूस होती है।",
                    mr: "मध्यम, फक्त ठरलेल्या वेळीच भूक लागते."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 9,
        question: {
            en: "What's your digestive health like?",
            hi: "आपका पाचन स्वास्थ्य कैसा है?",
            mr: "तुमचे पचन कसे आहे?"
        },
        image: "/images/Prakriti Assesment/Q9/Gemini_Generated_Image_x33x9ox33x9ox33x.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Irregular, often gassy, bloated or constipated.",
                    hi: "अनियमित, अक्सर गैस, पेट फूलना या कब्ज।",
                    mr: "अनियमित, अनेकदा गॅस, पोट फुगणे किंवा बद्धकोष्ठता जाणवते."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Quick digestion. Hungry 2-3 hours after a meal, sometimes acidity.",
                    hi: "तेज पाचन। भोजन के 2-3 घंटे बाद फिर भूख, कभी एसिडिटी।",
                    mr: "खूप वेगवान पचन. जेवणानंतर २-३ तासांत भूक लागते, कधी पित्त होते."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Slow digestion. Take time to feel hungry again, feel heavy.",
                    hi: "धीमा पाचन। फिर से भूख लगने में समय लगता है, भारीपन महसूस होता है।",
                    mr: "पचन संथ आहे. पुन्हा भूक लागण्यास वेळ लागतो, जडपणा जाणवतो."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 10,
        question: {
            en: "What's your sleep like?",
            hi: "आपकी नींद कैसी है?",
            mr: "तुमची झोप कशी असते?"
        },
        image: "/images/Prakriti Assesment/Q10/Gemini_Generated_Image_k47iy3k47iy3k47i.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Light sleep, easily wake up with sounds. Trouble sleeping.",
                    hi: "कच्ची नींद, आवाज़ से जल्दी खुल जाती है। नींद आने में दिक्कत।",
                    mr: "कमी झोप, आवाजाने लगेच जाग येते. झोपायला त्रास होतो."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Moderate sleep and wake up fresh and ready for action.",
                    hi: "मध्यम नींद और सुबह ताज़गी के साथ जागते हैं।",
                    mr: "मध्यम झोप आणि सकाळी ताजेतवाने होऊन जाग येते."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Very deep sleep, takes time to wake up in the morning.",
                    hi: "बहुत गहरी नींद, सुबह उठने में समय लगता है।",
                    mr: "खूप गाढ झोप, सकाळी उठायला वेळ लागतो."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 11,
        question: {
            en: "What best describes your typical concentration style?",
            hi: "आपकी एकाग्रता शैली का सबसे अच्छा वर्णन क्या है?",
            mr: "तुमची एकाग्रता (Concentration) कशी आहे?"
        },
        image: "/images/Prakriti Assesment/Q11/Gemini_Generated_Image_pi1ujbpi1ujbpi1u.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Constantly fluctuating. Hard to stay on one thing for long.",
                    hi: "लगातार बदलती रहती है। एक चीज़ पर टिकना मुश्किल है।",
                    mr: "सतत बदलणारी. एका गोष्टीवर जास्त वेळ लक्ष देणे कठीण जाते."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Can lock onto a task immediately. Might get impatient.",
                    hi: "काम पर तुरंत ध्यान केंद्रित कर सकते हैं। अधीर हो सकते हैं।",
                    mr: "एखाद्या कामावर लगेच लक्ष केंद्रित करू शकता. पण कधी कधी अधीर होऊ शकता."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Takes time to start, but once I start, focus is incredibly deep.",
                    hi: "शुरू करने में समय लगता है, लेकिन फिर ध्यान बहुत गहरा होता है।",
                    mr: "सुरुवात करायला वेळ लागतो, पण एकदा सुरू केले की एकाग्रता खूप खोल असते."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 12,
        question: {
            en: "How would you describe your natural voice?",
            hi: "आपकी आवाज़ कैसी है?",
            mr: "तुमचा आवाज कसा आहे?"
        },
        image: "/images/Prakriti Assesment/Q12/Gemini_Generated_Image_yi1ep5yi1ep5yi1e.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Medium-pitched, thin, sometimes weak or soft-spoken.",
                    hi: "मध्यम स्वर, पतली, कभी-कभी कमजोर या मृदुभाषी।",
                    mr: "मध्यम आवाजाचा स्तर, पातळ, कधीकधी कमकुवत किंवा हळू बोलणारे."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Sharp, penetrating, clear, commanding tone.",
                    hi: "तीक्ष्ण, भेदक, स्पष्ट और आदेशात्मक स्वर।",
                    mr: "धारदार, स्पष्ट आणि अधिकारवाणीने बोलणारे."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Deep, clear, relaxed, pleasant, soft-tone.",
                    hi: "गहरा, स्पष्ट, शांत और सुखद स्वर।",
                    mr: "खोल, स्पष्ट, शांत आणि आनंददायी आवाज."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 13,
        question: {
            en: "How do you naturally communicate?",
            hi: "आप स्वाभाविक रूप से कैसे संवाद करते हैं?",
            mr: "तुम्ही संवाद कसा साधता?"
        },
        image: "/images/Prakriti Assesment/Q13/Gemini_Generated_Image_rb3m47rb3m47rb3m.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Fast, talkative, jump between topics.",
                    hi: "तेज, बातूनी, विषयों के बीच कूदना।",
                    mr: "वेगाने, खूप बोलणारे, एका विषयावरून दुसऱ्या विषयावर जाणारे."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Articulate, confident, sometimes commanding.",
                    hi: "सुस्पष्ट, आत्मविश्वासी, कभी-कभी आदेशात्मक।",
                    mr: "स्पष्टवक्ते, आत्मविश्वासी, कधीकधी अधिकारवाणीने बोलणारे."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Slow, measured, thoughtful, few words but impactful.",
                    hi: "धीमा, नपा-तुला, विचारशील, कम शब्द लेकिन प्रभावशाली।",
                    mr: "संथ, मोजक्या शब्दांत बोलणारे, विचारपूर्वक आणि प्रभावी."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 14,
        question: {
            en: "Lips Size",
            hi: "होंठों का आकार",
            mr: "ओठांचा आकार"
        },
        image: "/images/Prakriti Assesment/Q14/unnamed.jpg",
        options: [
            {
                id: "A",
                text: {
                    en: "Thin lips, tendency to get dry faster.",
                    hi: "पतले होंठ, जल्दी सूखने की प्रवृत्ति।",
                    mr: "पातळ ओठ, लवकर कोरडे पडण्याची प्रवृत्ती."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Medium size, upper lip might be darker/bigger.",
                    hi: "मध्यम आकार, ऊपरी होंठ गहरा या बड़ा हो सकता है।",
                    mr: "मध्यम आकार, वरचा ओठ गडद किंवा मोठा असू शकतो."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Both are big, smooth and even contrast.",
                    hi: "दोनों बड़े, चिकने और एक समान हैं।",
                    mr: "दोन्ही मोठे, मऊ आणि एकसारखे आहेत."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 15,
        question: {
            en: "Walking",
            hi: "चालने की शैली",
            mr: "चालण्याची पद्धत"
        },
        image: "/images/Prakriti Assesment/Q15/unnamed (1).jpg",
        options: [
            {
                id: "A",
                text: {
                    en: "Naturally fast, find it hard to slow down.",
                    hi: "स्वाभाविक रूप से तेज, धीमा चलना मुश्किल लगता है।",
                    mr: "नैसर्गिकरीत्या वेगाने चालणारे, हळू चालणे कठीण जाते."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Balanced, can be faster when needed.",
                    hi: "संतुलित, ज़रूरत पड़ने पर तेज हो सकते हैं।",
                    mr: "संतुलित, गरजेनुसार वेगाने चालू शकता."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Comfortable with slow walking with a calm mind.",
                    hi: "शांत मन से धीमी चाल आरामदायक लगती है।",
                    mr: "शांत मनाने हळू चालणे आवडते."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 16,
        question: {
            en: "Stress Reaction",
            hi: "तनाव के प्रति प्रतिक्रिया",
            mr: "ताणाखाली कशी प्रतिक्रिया देता?"
        },
        image: "/images/Prakriti Assesment/Q16/Gemini_Generated_Image_3u2co73u2co73u2c (1).png",
        options: [
            {
                id: "A",
                text: {
                    en: "Feel anxious, nervous, fearful, and tense easily.",
                    hi: "चिंतित, घबराया हुआ, भयभीत महसूस करना।",
                    mr: "चिंता, भीती किंवा दडपण जाणवते."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Angry, impatient, irritable and frustrated.",
                    hi: "क्रोधित, अधीर, चिड़चिड़ा और निराश।",
                    mr: "रागीट, अधीर, चिडचिडेपणा किंवा नैराश्य येते."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Feel emotionally down, withdrawal and low motivation.",
                    hi: "भावनात्मक रूप से सुस्त, पीछे हटना और कम प्रेरणा।",
                    mr: "भावनिकरित्या खचलेले वाटणे, अलिप्त राहणे आणि कमी उत्साह जाणवणे."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 17,
        question: {
            en: "How quickly do you make decisions? After deciding, how often change?",
            hi: "आप निर्णय कितनी जल्दी लेते हैं? क्या आप बार-बार बदलते हैं?",
            mr: "तुम्ही निर्णय किती लवकर घेता? घेतल्यावर तो बदलता का?"
        },
        image: "/images/Prakriti Assesment/Q17/Gemini_Generated_Image_u4q44zu4q44zu4q4.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Quick but often changes decisions frequently.",
                    hi: "तेजी से लेकिन अक्सर बार-बार निर्णय बदलते हैं।",
                    mr: "लवकरात लवकर पण निर्णय वारंवार बदलतात."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Decisive, stick to decision but can change if needed.",
                    hi: "निर्णायक, निर्णय पर टिके रहते हैं लेकिन ज़रूरत पड़ने पर बदल सकते हैं।",
                    mr: "निक्षून निर्णय घेणारे, निर्णयावर ठाम राहणारे पण गरजेनुसार बदलणारे."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Slow, deliberate, take time but firm once decided.",
                    hi: "धीमा, सोच-समझकर, समय लेते हैं लेकिन एक बार तय करने पर अडिग।",
                    mr: "हळूवार, विचारपूर्वक वेळ घेणारे पण एकदा ठरवले की ठाम."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    },
    {
        id: 18,
        question: {
            en: "Your bowel movement pattern is:",
            hi: "आपका मल त्याग पैटर्न कैसा है?",
            mr: "पोट साफ होण्याची पद्धत कशी आहे?"
        },
        image: "/images/Prakriti Assesment/Q18/Gemini_Generated_Image_q99tvhq99tvhq99t.png",
        options: [
            {
                id: "A",
                text: {
                    en: "Irregular intervals, often constipated (hard stalls).",
                    hi: "अनियमित, अक्सर कब्ज (कड़ा मल)।",
                    mr: "अनियमित, अनेकदा बद्धकोष्ठता (कठोर मल)."
                },
                score: { Vata: 1, Pitta: 0, Kapha: 0 }
            },
            {
                id: "B",
                text: {
                    en: "Regular 1-2x daily (soft/loose stools).",
                    hi: "नियमित दिन में 1-2 बार (नरम मल)।",
                    mr: "नियमित दिवसातून १-२ वेळा (मऊ मल)."
                },
                score: { Vata: 0, Pitta: 1, Kapha: 0 }
            },
            {
                id: "C",
                text: {
                    en: "Infrequent, sluggish (thick/sticky stools).",
                    hi: "अक्सर नहीं, सुस्त (गाढ़ा/चिपचिपा मल)।",
                    mr: "रेंगाळणारे, संथ (जाड/चिकट मल)."
                },
                score: { Vata: 0, Pitta: 0, Kapha: 1 }
            }
        ]
    }
];
