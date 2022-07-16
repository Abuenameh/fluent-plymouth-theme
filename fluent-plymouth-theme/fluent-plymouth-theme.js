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
	// ConvertScalingRate(0.14),
	// ConvertScalingRate(0.14)
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

//--------------------------------------------- Dialogue ----------------------------------------------------//

status = "normal";

function dialog_setup() {
	local.box;
	local.lock;
	local.entry;

	box.image = Image("box.png");
	lock.image = Image("lock.png");
	entry.image = Image("entry.png");

	box.sprite = Sprite(box.image);
	box.x = Window.GetX() + Window.GetWidth() / 2 - box.image.GetWidth() / 2;
	box.y = (Window.GetY() + Window.GetHeight() / 2 - box.image.GetHeight() / 2) + logo.image.GetHeight();
	box.z = 10000;
	box.sprite.SetPosition(box.x, box.y, box.z);

	lock.sprite = Sprite(lock.image);
	lock.x = box.x + box.image.GetWidth() / 2 - (lock.image.GetWidth() + entry.image.GetWidth()) / 2;
	lock.y = box.y + box.image.GetHeight() / 2 - lock.image.GetHeight() / 2;
	lock.z = box.z + 1;
	lock.sprite.SetPosition(lock.x, lock.y, lock.z);

	entry.sprite = Sprite(entry.image);
	entry.x = lock.x + lock.image.GetWidth();
	entry.y = box.y + box.image.GetHeight() / 2 - entry.image.GetHeight() / 2;
	entry.z = box.z + 1;
	entry.sprite.SetPosition(entry.x, entry.y, entry.z);

	global.dialog.box = box;
	global.dialog.lock = lock;
	global.dialog.entry = entry;
	global.dialog.bullet_image = Image("bullet.png");
	dialog_opacity(1);
}

function dialog_opacity(opacity) {
	dialog.box.sprite.SetOpacity(opacity);
	dialog.lock.sprite.SetOpacity(opacity);
	dialog.entry.sprite.SetOpacity(opacity);

	for (index = 0; dialog.bullet[index]; index++)
		dialog.bullet[index].sprite.SetOpacity(opacity);
}

function display_normal_callback() {
	global.status = "normal";
	if (global.dialog) dialog_opacity(0);
}

function display_password_callback(prompt, bullets) {
	global.status = "password";

	if (!global.dialog) dialog_setup();
	else dialog_opacity(1);

	for (index = 0; dialog.bullet[index] || index < bullets; index++) {
		if (!dialog.bullet[index]) {
			dialog.bullet[index].sprite = Sprite(dialog.bullet_image);
			dialog.bullet[index].x = dialog.entry.x + index * dialog.bullet_image.GetWidth();
			dialog.bullet[index].y = dialog.entry.y + dialog.entry.image.GetHeight() / 2 - dialog.bullet_image.GetHeight() / 2;
			dialog.bullet[index].z = dialog.entry.z + 1;
			dialog.bullet[index].sprite.SetPosition(
				dialog.bullet[index].x,
				dialog.bullet[index].y,
				dialog.bullet[index].z
			);
		}

		if (index < bullets) dialog.bullet[index].sprite.SetOpacity(1);
		else dialog.bullet[index].sprite.SetOpacity(0);
	}
}

//Plymouth.SetDisplayNormalFunction(display_normal_callback);
//Plymouth.SetDisplayPasswordFunction(display_password_callback);

//-------------------------------------------- Progress Bar --------------------------------------------------//

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

//---------------------------------------------- Message -------------------------------------------------//

message_sprites = [];
message_sprite_count = 0;
message_sprite_y = 10;

function display_message_callback(text) {
	my_image = Image.Text(text, 1, 1, 1);

	message_sprites[message_sprite_count] = Sprite(my_image);
	message_sprites[message_sprite_count].SetPosition(10, message_sprite_y, 10000);
	message_sprites[message_sprite_count].text = text;
	message_sprite_count++;
	message_sprite_y += my_image.GetHeight();
}

function hide_message_callback(text) {
	for (i = 0; i < message_sprite_count; i++) {
		if (message_sprites[i].text == text)
			message_sprites[i] = NULL;
	}
}

//Plymouth.SetDisplayMessageFunction(display_message_callback);
//Plymouth.SetHideMessageFunction(hide_message_callback);
