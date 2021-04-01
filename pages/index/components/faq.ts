import { Card, createElement, modernCard, Title } from "@lucsoft/webgen";
import { RenderingX } from "@lucsoft/webgen/bin/lib/RenderingX";
import '../../../assets/css/components/team.css';

export function renderFAQ(render: RenderingX) {
    const data = createElement('article')
    data.id = "faq"
    render.toCustom({ maxWidth: "50rem", shell: data }, {}, () => [
        Title({
            type: "small",
            title: "FREQUENTLY ASKED QUESTIONS",
            subtitle: "Get advice and answers from BBN Holding"
        }),
        Card({},
            modernCard({
                title: "How much of the income goes to me?",
                description: "You get around 95% (its a non fixed cut, in some cases you can get up to 100%) of the income from your products every month on the 21st. We keep the remaining 5% to compensate for operating costs etc."
            })
        )
    ])

    return data;
}
