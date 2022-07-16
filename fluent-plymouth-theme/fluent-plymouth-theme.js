//---------------------------------[ GnApple Plymouth Theme by Supdrewin ]-------------------------------------//

Window.SetBackgroundTopColor(0, 0, 0);
Window.SetBackgroundBottomColor(0, 0, 0);

function ConvertScalingRate(scaling_rate) {
	scaling_rate *= Window.GetHeight();
	return scaling_rate;
}

background.original_image = Image("background.png");
background.image = background.original_image.Scale(Window.GetWidth(), Window.GetHeight());
background.sprite = Sprite(background.image);
background.sprite.SetX(0);
background.sprite.SetY(0);

logo.original_image = Image("kde.png");
logo.image = logo.original_image.Scale(
	ConvertScalingRate(0.3),
	ConvertScalingRate(0.3)
);
logo.sprite = Sprite(logo.image);

logo.sprite.SetOpacity(1);
logo.sprite.SetX((Window.GetX() + Window.GetWidth() - logo.image.GetWidth()) / 2);
logo.sprite.SetY((Window.GetY() + Window.GetHeight() - logo.image.GetHeight()) * 0.45);
logo.sprite.SetY(Window.GetHeight() / 3);

// Screen size
screen.w = Window.GetWidth();
screen.h = Window.GetHeight();
screen.half.w = Window.GetWidth() / 2;
screen.half.h = Window.GetHeight() / 2;

// Question prompt
question = null;
answer = null;

// Message
message = null;

// Password prompt
bullets = null;
prompt = null;
bullet.image = Image.Text("*", 1, 1, 1);

//------------------------------------- Password prompt -------------------------------
function DisplayQuestionCallback(prompt, entry) {
    question = null;
    answer = null;

    if (entry == "")
        entry = "<answer>";

    question.image = Image.Text(prompt, 1, 1, 1);
    question.sprite = Sprite(question.image);
    question.sprite.SetX(screen.half.w - question.image.GetWidth() / 2);
    question.sprite.SetY(screen.h - 6 * question.image.GetHeight());

    answer.image = Image.Text(entry, 1, 1, 1);
    answer.sprite = Sprite(answer.image);
    answer.sprite.SetX(screen.half.w - answer.image.GetWidth() / 2);
    answer.sprite.SetY(screen.h - 4 * answer.image.GetHeight());
}
Plymouth.SetDisplayQuestionFunction(DisplayQuestionCallback);

//------------------------------------- Password prompt -------------------------------
function DisplayPasswordCallback(nil, bulletCount) {
    state.status = "pause";
    totalWidth = bulletCount * bullet.image.GetWidth();
    startPos = screen.half.w - totalWidth / 2;

    prompt.image = Image.Text("Enter Password", 1, 1, 1);
    prompt.sprite = Sprite(prompt.image);
    prompt.sprite.SetX(screen.half.w - prompt.image.GetWidth() / 2);
    prompt.sprite.SetY(screen.h - 6 * prompt.image.GetHeight());

    // Clear all bullets (user might hit backspace)
    bullets = null;
    for (i = 0; i < bulletCount; i++) {
        bullets[i].sprite = Sprite(bullet.image);
        bullets[i].sprite.SetX(startPos + i * bullet.image.GetWidth());
        bullets[i].sprite.SetY(screen.h - 4 * bullet.image.GetHeight());
    }
}
Plymouth.SetDisplayPasswordFunction(DisplayPasswordCallback);

//--------------------------- Normal display (unset all text) ----------------------
function DisplayNormalCallback() {
    state.status = "play";
    bullets = null;
    prompt = null;
    message = null;
    question = null;
    answer = null;
}
Plymouth.SetDisplayNormalFunction(DisplayNormalCallback);

//----------------------------------------- Message --------------------------------
function MessageCallback(text) {
    message.image = Image.Text(text, 1, 1, 1);
    message.sprite = Sprite(message.image);
    message.sprite.SetPosition(screen.half.w - message.image.GetWidth() / 2, message.image.GetHeight());
}
Plymouth.SetMessageFunction(MessageCallback);

//-------------------------------------------- Spinner --------------------------------------------------//

if (Plymouth.GetMode() == "boot") {
	spin.original_image = Image("spin/spin0.png");
	spin.image = spin.original_image.Scale(ConvertScalingRate(0.03), ConvertScalingRate(0.03));

	spin.sprite = Sprite();
	spin.sprite.SetX((Window.GetX() + Window.GetWidth() - spin.image.GetWidth()) / 2);
	spin.sprite.SetY((Window.GetY() + Window.GetHeight() - spin.image.GetHeight()) * 0.65);
	spin.sprite.SetY(Window.GetY() + Window.GetHeight() * 0.65);

	function progress_callback(time) {
		spin.original_image = Image("spin/spin" + Math.Int((time * 6) % 12) + ".png");
		spin.image = spin.original_image.Scale(ConvertScalingRate(0.03), ConvertScalingRate(0.03));
		spin.sprite.SetImage(spin.image);
	}
}

Plymouth.SetBootProgressFunction(progress_callback);

//----------------------------------------------- Quit ---------------------------------------------------//

function quit_callback() { logo.sprite.SetOpacity(1); }
Plymouth.SetQuitFunction(quit_callback);
