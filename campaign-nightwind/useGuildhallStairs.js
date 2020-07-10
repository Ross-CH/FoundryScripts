/**
 * Allows traversal of staircases in the "Nightwind - Guildhall" map.
 *
 * May require factoring out to a module (hence the `class`) in order to teleport players through walls they would
 * otherwise be blocked by (using a "send command to GM" workflow).
 */
(async () => {
	if (!token) ui.notifications.error(`No token selected!`);

	class UseGuildhallStairs {
		static async pRun () {
			const stair = this._getTokensAt(
				canvas.tokens.placeables,
				{
					x: token.data.x + (token.w / 2),
					y: token.data.y + (token.h / 2),
				}
			).find(it => it.name === "Stairs");
			if (!stair) return ui.notifications.warn(`No stairs under your token!`);

			const linkedStair = ([
				this._getLinkedTokenSet(stair, 1, 0),
				this._getLinkedTokenSet(stair, -1, 0),
				this._getLinkedTokenSet(stair, 0, 1),
				this._getLinkedTokenSet(stair, 0, -1),
				this._getLinkedTokenSet(stair, 1, 1),
				this._getLinkedTokenSet(stair, -1, -1),
				this._getLinkedTokenSet(stair, 1, -1),
				this._getLinkedTokenSet(stair, -1, 1),
			].find(it => it.length) || []).flat().find(Boolean);
			if (!linkedStair) return ui.notifications.warn(`Could not find linked stairs!`);

			await token.update({
				x: linkedStair.data.x,
				y: linkedStair.data.y
			});

			canvas.pan({
				x: linkedStair.data.x + ((ui.sidebar._collapsed ? 0 : 1) * (UseGuildhallStairs._W_SIDEBAR / 2)) + (linkedStair.w / 2),
				y: linkedStair.data.y + (linkedStair.h / 2),
			});
		}

		static _getLinkedTokenSet (stairToken, dirX, dirY) {
			return this._getTokensAt(
				canvas.tokens.placeables,
				{
					x: stairToken.data.x + (stairToken.w / 2) + (dirX * UseGuildhallStairs._OFFSET),
					y: stairToken.data.y + (stairToken.h / 2) + (dirY * UseGuildhallStairs._OFFSET),
				}
			)
		}

		static _tokenContains (token, position) {
			return Number.between(position.x, token.data.x, token.data.x + token.w)
				&& Number.between(position.y, token.data.y, token.data.y + token.h);
		}

		static _getTokensAt (tokens, position) {
			return tokens.filter(token => this._tokenContains(token, position));
		}
	}
	UseGuildhallStairs._OFFSET = 210 / 5 * 70
	UseGuildhallStairs._W_SIDEBAR = 300;

	return UseGuildhallStairs.pRun();
})();
