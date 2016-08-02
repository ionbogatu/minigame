$(function(){
	$('body').on("click", "div[class*=column-]", function(){
		self = $(this);

		if(
			self.is('[class*=computer]') ||
			self.is('[class*=server]')
		){
			return;
		}

		self.css({'transition': 'transform 0.1s ease-in-out'}).addClass('rotate');

		setTimeout(function(){
			self.css({'transition': 'none'});

			var row = self.parent().parent().data('row');
			var column = self.data('column');

			$.ajax({
				'url': '/rotate',
				'method': 'post',
				'data': {
					'row': row,
					'column': column
				},
				'success': function(data){
					if(data){
						$('body').html(data);
					}
				}
			});
		}, 100);
	});
});