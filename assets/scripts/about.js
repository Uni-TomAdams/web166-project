function onSubPageClickHandler(btnID) {

    // About Button
    if(btnID == "btnAbout") {
        var contentText = $("#aboutContent").text("Originating from Cornwall, and was born on the 17th of July, 1999. I lived in an old\n" +
            "cottage until the age of 5, until we immigrated to ChristChurch, New Zealand. As we settled into the new culture and environment, we met 2 British and 1 American family, whom became our long-term friends to this day. After spending 6 years and making many memories, due to unforeseen circumstances, we moved back to Cornwall to present date.\n" +
            "\n" +
            "Once I left secondary school, I then went onto becoming a Refrigeration and Air-conditioning Engineer. Working across Cornwalls RAF bases, super-yachts, Royal Navy Auxiliary Fleet, and other. It became apparent that my passion for tech was where I wanted to be, so I left the Refrigeration and Air-conditioning industry, went to college doing Software Development and now at university studying Computer Science.");

        $("#aboutTitle").text("About");
        contentText.html(contentText.html().replace(/\n/g,'<br/>'));
    }

    // Education Button
    if(btnID == "btnEducation") {
        var contentText = $("#aboutContent").text("GCSE (Pool Academy 2010-2015):\n" +
            "- English (C).\n" +
            "- Mathematics (B).\n" +
            "- Electronics (A*).\n" +
            "- Science (A).\n" +
            "\n" +
            "BTEC Software Development (Truro College 2017-2019):\n" +
            "- D*D*D*\n" +
            "\n" +
            "BSc. Computer Science (Plymouth Unversity 2019-Present):\n" +
            "- Aim (1:1)…");

        $("#aboutTitle").text("Education");
        contentText.html(contentText.html().replace(/\n/g,'<br/>'));
    }

    // Interest Button
    if(btnID == "btnInterests") {
        var contentText = $("#aboutContent").text("Technology has been a significant interest of mine since about 7. I have been programming since 14, where I first started to learn OOP concepts using Java, coding plugins and custom clients for Minecraft servers. From there I went onto developing in IOS app development, building small games, such as TicTacToe etc. I then decided to move into web development as it involved more technical aspects of programming and also learning about servers, databases, web-stacks and more.\n" +
            "\n" +
            "As of outside of programming, I enjoy reading books around tech, psychology, entrepreneurship and the odd self-help book. I’m extremely interested in future technologies and how we can apply them to problems that currently exist in the world, along with trying new and innovative ideas, something I am aiming towards doing in the future.");

        $("#aboutTitle").text("Interest");
        contentText.html(contentText.html().replace(/\n/g,'<br/>'));
    }
}

$(document).ready(function() {

    onSubPageClickHandler("btnAbout");

    $("#btnAbout").click(function() {
        onSubPageClickHandler("btnAbout");
    });
    $("#btnEducation").click(function() {
        onSubPageClickHandler("btnEducation");
    });
    $("#btnInterests").click(function() {
        onSubPageClickHandler("btnInterests");
    });
});